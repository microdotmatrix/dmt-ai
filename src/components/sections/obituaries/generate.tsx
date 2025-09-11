"use client";

import { Response } from "@/components/ai/response";
import { DirectionAwareTabs } from "@/components/elements/animated-tabs";
import { Typewriter } from "@/components/elements/typewriter";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  generateObituary,
  generateObituaryFromDocument,
} from "@/lib/ai/actions";
import { models } from "@/lib/ai/models";
import type { Entry, EntryDetails } from "@/lib/db/schema";
import { convertFileToDataURL } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { readStreamableValue } from "@ai-sdk/rsc";
import { LanguageModel } from "ai";
import Link from "next/link";
import { useCallback, useRef, useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { EntryDetailsCard } from "../entries/details-card";
import { EntryCard } from "../entries/entry-card";
import { ModelSelector } from "./model-selector";
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
  const [obituaryId, setObituaryId] = useState<string | undefined>(undefined);

  const [languageModel, setLanguageModel] = useState<LanguageModel>(
    models.openai
  );
  const [content, setContent] = useState<string | undefined>(undefined);

  const [mode, setMode] = useState(0);

  const handleModeChange = (newMode: number) => {
    setMode(newMode);
  };

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

  const tabs = [
    {
      id: 0,
      label: "Create",
      content: (
        <ObituaryForm
          entry={entry}
          entryDetails={entryDetails!}
          completed={completed}
          formAction={formAction}
          isPending={isPending}
          tone={tone}
          style={style}
          toInclude={toInclude}
          toAvoid={toAvoid}
          isReligious={isReligious}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      id: 1,
      label: "Upload",
      content: (
        <UploadForm
          entry={entry}
          entryId={entry.id}
          setContent={setContent}
          setCompleted={setCompleted}
          setObituaryId={setObituaryId}
        />
      ),
    },
  ];

  return (
    <div className="grid md:grid-cols-6 gap-4 px-4 xl:px-8 loading-fade">
      <aside className="md:col-span-3 2xl:col-span-2 space-y-4 order-2 md:order-1">
        <EntryCard entry={entry} />
        <EntryDetailsCard
          entry={entry}
          entryDetails={entryDetails!}
          collapsible
        />

        <p className="text-xs text-muted-foreground text-center text-balance px-4">
          <span className="font-semibold">NOTE:</span> The more details you can
          provide, the better the result. Most of the fields in the details form
          are optional, because we understand that some will have incomplete
          information.
        </p>

        <ModelSelector />

        <DirectionAwareTabs tabs={tabs} onChange={handleModeChange} />
      </aside>
      <article className="md:col-span-3 2xl:col-span-4 order-1 md:order-2 py-8">
        <div className="max-w-6xl mx-auto">
          {!completed && !isPending && (
            <Typewriter
              text="> Complete the form to generate an obituary..."
              repeat={false}
              className="my-8"
            />
          )}
          {!completed && isPending && (
            <Typewriter
              text={`> Generating an obituary for ${entry.name}...`}
              repeat={false}
              className="my-8"
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
      </article>
    </div>
  );
};

const ObituaryForm = ({
  entry,
  entryDetails,
  completed,
  formAction,
  isPending,
  tone,
  style,
  toInclude,
  toAvoid,
  isReligious,
  handleInputChange,
}: {
  entry: Entry;
  entryDetails: EntryDetails;
  completed: boolean;
  formAction: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  tone: string;
  style: string;
  toInclude: string;
  toAvoid: string;
  isReligious: boolean;
  handleInputChange: (field: string, value: string) => void;
}) => {
  // TODO: Add more advanced logic to validate entry details and determine if they are complete
  const needsMoreInfo = !entryDetails;

  return (
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
            handleInputChange("style", "modern");
            handleInputChange("tone", "reverent");
            handleInputChange("toInclude", "");
            handleInputChange("toAvoid", "");
            handleInputChange("isReligious", "false");
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
          {!needsMoreInfo && isPending ? "Generating..." : "Generate Obituary"}
          {!needsMoreInfo && isPending ? (
            <Icon icon="mdi:loading" className="size-4 animate-spin" />
          ) : (
            <Icon icon="mdi:arrow-right" className="size-4" />
          )}
        </Button>
      </section>
    </form>
  );
};

const UploadForm = ({
  entry,
  entryId,
  setContent,
  setCompleted,
  setObituaryId,
}: {
  entry: Entry;
  entryId: string;
  setContent: (content: string) => void;
  setCompleted: (completed: boolean) => void;
  setObituaryId: (id: string) => void;
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Check file size (max 10MB for PDFs)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File must be smaller than 10MB");
        return;
      }

      setUploadedFile(file);
      toast.success(`PDF "${file.name}" ready for upload`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    disabled: uploading,
    multiple: false,
    maxFiles: 1,
  });

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!uploadedFile) {
      toast.error("Please upload a PDF file");
      return;
    }

    startTransition(async () => {
      setUploading(true);
      const fileData = await convertFileToDataURL(uploadedFile);
      
      // Extract base64 data from data URL (standard base64 format)
      const base64Data = fileData.url.split(',')[1]; // Remove "data:application/pdf;base64," prefix

      const formDataObj = new FormData();
      Object.entries({
        name: entry.name,
        instructions,
        file: base64Data,
      }).forEach(([key, value]) => {
        formDataObj.append(key, String(value));
      });

      const { success, result, error, id } = await generateObituaryFromDocument(
        entryId,
        {
          data: formDataObj,
        }
      );

      if (error) {
        console.error("Failed to generate obituary", error);
        return;
      }
      if (success) {
        startTransition(async () => {
          try {
            // let text = "";
            for await (const text of readStreamableValue(result)) {
              setContent(text!);
            }
            setObituaryId(id!);
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
    <form className="py-4 px-4 lg:px-2 space-y-6" onSubmit={handleSubmit}>
      {/* File Upload Section */}
      <div className="space-y-2">
        <Label htmlFor="pdf-upload" className="text-sm font-medium">
          Upload Existing Obituary
        </Label>
        <p className="text-xs text-muted-foreground">
          Upload a PDF document to use as a starting point for the AI-generated
          obituary.
        </p>

        {/* File Display */}
        {uploadedFile && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-muted">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:file-pdf-box" className="h-8 w-8 text-red-600" />
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate max-w-[200px]">
                  {uploadedFile.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="h-8 w-8 p-0"
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Dropzone */}
        {!uploadedFile && (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/5",
              uploading && "opacity-50 cursor-not-allowed"
            )}
          >
            <Input {...getInputProps()} id="pdf-upload" ref={fileInputRef} />
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-muted/50">
                <Icon
                  icon={
                    uploading
                      ? "lucide:loader-2"
                      : isDragActive
                      ? "lucide:file-down"
                      : "lucide:file-plus"
                  }
                  className={cn(
                    "h-8 w-8 text-muted-foreground",
                    uploading && "animate-spin",
                    isDragActive && "text-primary"
                  )}
                />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {uploading
                    ? "Processing..."
                    : isDragActive
                    ? "Drop the PDF here"
                    : "Drag & drop a PDF file here"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse your files
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                PDF files only • Max 10MB
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions Section */}
      <div className="space-y-2">
        <Label htmlFor="instructions" className="text-sm font-medium">
          Additional Instructions
          <span className="text-muted-foreground font-normal ml-2">
            (Optional)
          </span>
        </Label>
        <p className="text-xs text-muted-foreground">
          Provide any specific instructions for how you'd like the AI to use or
          modify the uploaded document.
        </p>
        <Textarea
          id="instructions"
          placeholder="Example: Please maintain the formal tone but shorten the biography section. Add more details about their community involvement and update the surviving family members list..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="min-h-[120px] resize-none"
          disabled={uploading}
        />
        <div className="flex justify-end">
          <span className="text-xs text-muted-foreground">
            {instructions.length} / 500 characters
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <section className="flex items-center gap-4 mt-8">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          disabled={uploading || (!uploadedFile && !instructions)}
          onClick={() => {
            setUploadedFile(null);
            setInstructions("");
          }}
          className="flex-auto bg-muted/50 border border-muted/50"
        >
          Clear
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={uploading || !uploadedFile || isPending}
          className="flex-auto flex items-center gap-2"
        >
          {isPending ? "Processing..." : "Generate from PDF"}
          {isPending ? (
            <Icon icon="mdi:loading" className="size-4 animate-spin" />
          ) : (
            <Icon icon="mdi:arrow-right" className="size-4" />
          )}
        </Button>
      </section>
    </form>
  );
};
