"use client";

import { AnimatedInput } from "@/components/elements/form/animated-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Entry, EntryDetails } from "@/lib/db/schema";
import { entryDetailsFormAtom } from "@/lib/state";
import { useSetAtom } from "jotai";

export const ObituaryOptions = ({
  tone,
  style,
  toInclude,
  toAvoid,
  isReligious,
  completed,
  isPending,
  handleInputChange,
}: {
  entry: Entry;
  entryDetails: EntryDetails;
  tone: string;
  style: string;
  toInclude: string;
  toAvoid: string;
  isReligious: boolean;
  completed: boolean;
  isPending: boolean;
  handleInputChange: (field: string, value: string) => void;
}) => {
  const setOpenDetails = useSetAtom(entryDetailsFormAtom);

  const toneOptions = [
    {
      value: "reverent",
      label: "Reverent",
      description: "Respectful and deeply honoring (default)",
    },
    { value: "somber", label: "Somber", description: "Serious and reflective" },
    {
      value: "uplifting",
      label: "Uplifting",
      description: "Positive and celebratory",
    },
    {
      value: "humorous",
      label: "Humorous",
      description: "Light-hearted with gentle humor",
    },
    {
      value: "formal",
      label: "Formal",
      description: "Traditional and dignified",
    },
    {
      value: "personal",
      label: "Personal",
      description: "Intimate and heartfelt",
    },
    {
      value: "inspiring",
      label: "Inspiring",
      description: "Motivational and encouraging",
    },
  ];

  return (
    <>
      <div>
        <Label htmlFor="style">Style</Label>
        <RadioGroup
          defaultValue={style}
          onValueChange={(value) => handleInputChange("style", value)}
          className="flex flex-row gap-8 my-4"
        >
          <div className="flex items-center gap-4 [&>label]:mt-0.75">
            <RadioGroupItem id="modern" value="modern" />
            <Label htmlFor="modern">Modern</Label>
          </div>
          <span className="flex items-center gap-4 [&>label]:mt-0.75">
            <RadioGroupItem id="traditional" value="traditional" />
            <Label htmlFor="traditional">Traditional</Label>
          </span>
        </RadioGroup>
      </div>
      <Separator />
      <Label htmlFor="tone">Desired Tone</Label>
      <RadioGroup
        defaultValue={tone}
        onValueChange={(value) => handleInputChange("tone", value)}
        className="grid md:grid-cols-2 mt-4"
      >
        <section className="space-y-3 flex-1 [&>div]:gap-4 [&>div_label]:mt-0.75">
          {toneOptions.slice(0, 4).map((option) => (
            <div className="flex items-center" key={option.value}>
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="items-baseline">
                {option.label}
                <span className="text-xs font-normal text-muted-foreground">
                  {option.description}
                </span>
              </Label>
            </div>
          ))}
        </section>
        <section className="space-y-3 flex-1 [&>div]:gap-4 [&>div_label]:mt-0.75">
          {toneOptions.slice(4).map((option) => (
            <div className="flex items-center" key={option.value}>
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="items-baseline">
                {option.label}
                <span className="text-xs font-normal text-muted-foreground">
                  {option.description}
                </span>
              </Label>
            </div>
          ))}
        </section>
      </RadioGroup>
      <Separator />
      <section className="space-y-3">
        <Label htmlFor="avoidNotes">Miscellaneous Notes</Label>
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatedInput
            name="includeNotes"
            label="Things to Include"
            type="textarea"
            controlled={true}
            value={toInclude}
            onChange={(e) => handleInputChange("toInclude", e.target.value)}
            placeholder="Any specific topics or themes to include in the obituary..."
            className="h-16"
          />
          <AnimatedInput
            name="avoidNotes"
            label="Things to Avoid"
            type="textarea"
            controlled={true}
            value={toAvoid}
            onChange={(e) => handleInputChange("toAvoid", e.target.value)}
            placeholder="Any specific topics or themes to avoid mentioning in the obituary..."
            className="h-16"
          />
        </div>
      </section>
      <section className="flex items-center gap-4">
        <Checkbox
          id="isReligious"
          defaultChecked={isReligious || false}
          onCheckedChange={(checked) =>
            handleInputChange("isReligious", checked ? "true" : "false")
          }
        />
        <Label
          htmlFor="isReligious"
          className="flex flex-col items-start gap-0.5"
        >
          <span>
            Would you like this obituary to include religious content?
          </span>
          <span className="text-xs text-muted-foreground">
            Content will be determined by the denomination value set in the{" "}
            <span
              className="font-semibold text-primary cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setOpenDetails(true);
              }}
            >
              obituary details
            </span>{" "}
            form.
          </span>
        </Label>
      </section>
    </>
  );
};
