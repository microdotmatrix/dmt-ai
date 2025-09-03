"use client";

import { Response } from "@/components/ai/response";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateObituary } from "@/lib/ai/actions";
import { models } from "@/lib/ai/models";
import type { Entry, EntryDetails } from "@/lib/db/schema";
import { readStreamableValue } from "@ai-sdk/rsc";
import { LanguageModel } from "ai";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { EntryDetailsCard } from "../entries/details-card";
import { EntryCard } from "../entries/entry-card";
import { ObituaryOptions } from "./options";

export const GenerateObituary = ({
  entry,
  entryDetails,
}: {
  entry: Entry;
  entryDetails: EntryDetails;
}) => {
  const [isPending, startTransition] = useTransition();

  const [tone, setTone] = useState<string>("reverent");
  const [style, setStyle] = useState<string>("modern");
  const [toInclude, setToInclude] = useState<string>("");
  const [toAvoid, setToAvoid] = useState<string>("");
  const [isReligious, setIsReligious] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [startGenerating, setStartGenerating] = useState<boolean>(false);
  const [obituaryId, setObituaryId] = useState<string | undefined>(undefined);

  const [languageModel, setLanguageModel] = useState<LanguageModel>(
    models.openai
  );
  const [content, setContent] = useState<string | undefined>(undefined);

  const handleInputChange = (field: string, value: string) => {
    if (field === "tone") {
      setTone(value);
    } else if (field === "style") {
      setStyle(value);
    } else if (field === "toInclude") {
      setToInclude(value);
    } else if (field === "toAvoid") {
      setToAvoid(value);
    }
  };

  const formAction = async () => {
    setContent(undefined);

    const formDataObj = new FormData();
    Object.entries({
      name: entry.name,
      style,
      tone,
      toInclude,
      toAvoid,
      isReligious: Boolean(),
    }).forEach(([key, value]) => {
      formDataObj.append(key, String(value));
    });

    startTransition(async () => {
      const { success, result, error, id } = await generateObituary(entry.id, {
        data: formDataObj,
      });

      if (error) {
        console.error("Failed to generate obituary", error);
        return;
      }
      if (success) {
        startTransition(async () => {
          try {
            // let text = "";
            for await (const text of readStreamableValue(result)) {
              setContent(text);
            }
            setObituaryId(id);
          } catch (error) {
            console.error("Failed to read streamable value", error);
            toast.error("Failed to generate obituary");
          } finally {
            setCompleted(true);
            toast.success("Obituary generated successfully");
          }
        });
      }
    });
  };
  return (
    <div className="grid lg:grid-cols-6 gap-4 px-4 lg:px-8">
      <aside className="lg:col-span-2 space-y-4">
        <EntryCard entry={entry} />
        <EntryDetailsCard entry={entry} entryDetails={entryDetails!} />

        <form action={formAction} className="py-4 px-4 lg:px-2">
          <ObituaryOptions
            entry={entry}
            entryDetails={entryDetails!}
            tone={tone}
            style={style}
            toInclude={toInclude}
            toAvoid={toAvoid}
            isReligious={isReligious}
            completed={completed}
            isPending={isPending}
            handleInputChange={handleInputChange}
          />
          <section className="flex items-center gap-4">
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Generating..." : "Generate Obituary"}
            </Button>
            <Button
              type="reset"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                setStyle("modern");
                setTone("reverent");
                setToInclude("");
                setToAvoid("");
                setIsReligious(false);
              }}
              className="flex-1"
            >
              Reset
            </Button>
          </section>
        </form>
      </aside>
      <aside className="lg:col-span-4">
        <div className="flex flex-col lg:flex-row items-center gap-4 max-w-sm ml-auto mr-0 mb-8">
          <Label htmlFor="languageModel">Language Model</Label>
          <div className="flex-1">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select function coming soon..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="openrouter">OpenRouter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          {!completed && !isPending && (
            <p>Generated Obituary will appear here</p>
          )}
          {!completed && isPending && <p>Generating Obituary...</p>}

          <Response key={content}>{content}</Response>
          {completed && (
            <div className="flex flex-col gap-4 mt-12 border-t pt-8">
              <p>
                What do you think of this obituary? To make revisions, click
                "Edit"; or you can change your preferences on the left and click
                "Regenerate".
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href={`/${entry.id}/obituaries/${obituaryId}`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Edit
                </Link>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={async () => {
                    setCompleted(false);
                    setContent(undefined);
                    setObituaryId(undefined);
                    await formAction();
                  }}
                >
                  Regenerate
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
