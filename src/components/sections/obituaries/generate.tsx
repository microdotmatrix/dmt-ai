"use client";

import { Response } from "@/components/ai/response";
import { Typewriter } from "@/components/elements/typewriter";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
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

  const formAction = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
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

  // TODO: Add more advanced logic to validate entry details and determine if they are complete
  const needsMoreInfo = !entryDetails;

  return (
    <div className="grid md:grid-cols-6 gap-4 px-4 xl:px-8 loading-fade">
      <aside className="md:col-span-3 2xl:col-span-2 space-y-4">
        <EntryCard entry={entry} />
        <EntryDetailsCard
          entry={entry}
          entryDetails={entryDetails!}
          collapsible
        />

        <form className="py-4 px-4 lg:px-2" onSubmit={formAction}>
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
          <section className="flex items-center gap-4 mt-12">
            <Button
              type="reset"
              variant="ghost"
              size="lg"
              disabled={isPending || needsMoreInfo}
              onClick={() => {
                setStyle("modern");
                setTone("reverent");
                setToInclude("");
                setToAvoid("");
                setIsReligious(false);
              }}
              className="flex-auto bg-muted/50 border border-muted/50"
            >
              Reset
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isPending || needsMoreInfo}
              className="flex-auto flex items-center gap-2"
            >
              {needsMoreInfo && (
                <Icon icon="mdi:alert-outline" className="size-4" />
              )}
              {needsMoreInfo && "Details Needed"}
              {!needsMoreInfo && isPending
                ? "Generating..."
                : "Generate Obituary"}
              {!needsMoreInfo && isPending ? (
                <Icon icon="mdi:loading" className="size-4 animate-spin" />
              ) : (
                <Icon icon="mdi:arrow-right" className="size-4" />
              )}
            </Button>
          </section>
        </form>
      </aside>
      <aside className="md:col-span-3 2xl:col-span-4">
        <div className="flex flex-row items-center gap-4 px-4 md:px-0 lg:max-w-sm mx-auto md:mr-0 mb-8">
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
            <Typewriter
              text="> Complete the form to generate an obituary..."
              repeat={false}
              className="mt-8"
            />
          )}
          {!completed && isPending && (
            <Typewriter
              text={`> Generating an obituary for ${entry.name}...`}
              repeat={false}
              className="mt-8"
            />
          )}

          <Response key={content}>{content}</Response>
          {completed && (
            <div className="flex flex-col gap-4 mt-12 border-t py-8">
              <div className="grid lg:grid-cols-2 gap-8 max-w-lg mx-auto text-center">
                <div className="space-y-4">
                  <Link
                    href={`/${entry.id}/obituaries/${obituaryId}`}
                    className={buttonVariants({
                      variant: "default",
                      size: "lg",
                      className: "flex items-center gap-2 leading-0.5",
                    })}
                  >
                    Edit <Icon icon="mdi:pencil" />
                  </Link>
                  <p className="text-sm text-muted-foreground text-balance">
                    Use our interactive AI tools to make revisions
                  </p>
                </div>
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    className="flex items-center gap-2 mx-auto"
                    onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      setCompleted(false);
                      setContent(undefined);
                      setObituaryId(undefined);
                      await formAction(e);
                    }}
                  >
                    Regenerate <Icon icon="mdi:refresh" />
                  </Button>
                  <p className="text-sm text-muted-foreground text-balance">
                    If you'd like a different version, change your preferences
                    on the left and click "Regenerate"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
