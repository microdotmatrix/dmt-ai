"use client";

import { AnimatedInput } from "@/components/elements/form/animated-input";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { updateEntryAction } from "@/lib/db/actions/entries";
import { ActionState } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export const EntryForm = ({ entry }: { entry: any }) => {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateEntryAction,
    {
      error: "",
    }
  );

  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    entry.dateOfBirth ? new Date(entry.dateOfBirth) : undefined
  );

  const [dateOfDeath, setDateOfDeath] = useState<Date | undefined>(
    entry.dateOfDeath ? new Date(entry.dateOfDeath) : undefined
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Entry updated successfully");
    }
    if (state.error) {
      toast.error("Failed to update entry");
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={entry.id} />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Image Section */}
        {/* Current Image Display */}
        <figure className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
          <Badge
            variant="outline"
            className="bg-muted absolute top-2 left-2 z-10"
          >
            Current Image
          </Badge>
          <Image
            src={entry.image}
            alt={entry.name}
            width={1280}
            height={720}
            className="object-cover size-full"
          />
        </figure>

        {/* Right Column: Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <AnimatedInput
            label="Full Name"
            name="name"
            defaultValue={entry.name}
            placeholder="Enter full name"
            required
          />

          {/* Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <AnimatedInput
              label="Birth Location"
              name="birthLocation"
              defaultValue={entry.locationBorn || ""}
              placeholder="City, State/Country"
              required
            />
            <AnimatedInput
              label="Death Location"
              name="deathLocation"
              defaultValue={entry.locationDied || ""}
              placeholder="City, State/Country"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="space-y-0.5">
              <Label
                htmlFor="dateOfBirth"
                className="text-xs font-normal ml-1.25"
              >
                Birth Date
              </Label>
              <DatePicker
                label="Birth Date"
                date={dateOfBirth}
                setDate={setDateOfBirth}
                buttonClasses="h-10 w-full"
              />
              <input
                type="hidden"
                name="dateOfBirth"
                defaultValue={dateOfBirth?.toISOString() || ""}
              />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="dateOfDeath" className="text-xs font-normal ml-3">
                Death Date
              </Label>
              <DatePicker
                label="Death Date"
                date={dateOfDeath}
                setDate={setDateOfDeath}
                buttonClasses="h-10 w-full"
              />
              <input
                type="hidden"
                name="dateOfDeath"
                defaultValue={dateOfDeath?.toISOString() || ""}
              />
            </div>
          </div>

          {/* Cause of Death */}
          <div className="space-y-8">
            <AnimatedInput
              label="Cause of Death"
              name="causeOfDeath"
              defaultValue={entry.causeOfDeath}
              placeholder="Enter cause of death"
              required
            />

            {/* Image URL Input */}
            <AnimatedInput
              label="Image URL"
              name="image"
              type="url"
              defaultValue={entry.image}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          {/* Submit Button - Full Width */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {pending ? (
                <Icon
                  icon="mdi:loading"
                  className="w-4 h-4 mr-2 animate-spin"
                />
              ) : (
                <Icon icon="mdi:content-save" className="w-4 h-4 mr-2" />
              )}
              {pending ? "Saving..." : "Save Changes"}
            </Button>
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "outline" })}
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};
