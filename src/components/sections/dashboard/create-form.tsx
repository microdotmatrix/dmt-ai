"use client";

import { FileUploader } from "@/components/elements/file-uploader";
import { AnimatedInput } from "@/components/elements/form/animated-input";
import { useUploadThing } from "@/components/elements/uploads";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { createEntryAction } from "@/lib/db/actions/entries";
import { useCreateForm, useEntryImage } from "@/lib/state";
import { ActionState, cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const CreateEntryForm = () => {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createEntryAction,
    {
      error: "",
    }
  );
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [deathDate, setDeathDate] = useState<Date | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const { setImage, setUploading } = useEntryImage();
  const { setOpen } = useCreateForm();
  const formRef = useRef<HTMLFormElement>(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadProgress: () => {
      setUploading(true);
    },
    onClientUploadComplete: (res) => {
      toast.success("Image uploaded successfully");
      setImageUrl(res[0]?.ufsUrl);
      setImage(res[0]?.ufsUrl);
      setUploading(false);
      setUploadComplete(true);
    },
    onUploadError: (error) => {
      toast.error("Error uploading image");
      setUploading(false);
    },
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Profile created successfully");
      formRef.current?.reset();
      setImage(null);
      setImageUrl(null);
      setOpen(false);
    } else if (state.error) {
      toast.error("Failed to create profile");
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6" ref={formRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <AnimatedInput
          name="name"
          type="text"
          label="Name"
          placeholder="Enter full name"
          defaultValue={state.name}
          required
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div>
          <DatePicker
            label="Date of Birth"
            date={birthDate}
            setDate={setBirthDate}
            buttonClasses="h-10 w-full"
          />
          <input
            type="hidden"
            name="dateOfBirth"
            defaultValue={birthDate?.toISOString() || ""}
          />
        </div>
        <div>
          <DatePicker
            label="Date of Death"
            date={deathDate}
            setDate={setDeathDate}
            buttonClasses="h-10 w-full"
          />
          <input
            type="hidden"
            name="dateOfDeath"
            defaultValue={deathDate?.toISOString() || ""}
          />
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <div>
          <AnimatedInput
            name="birthLocation"
            label="Birth Location"
            placeholder="City, State/Country"
            defaultValue={state.birthLocation}
          />
        </div>
        <div>
          <AnimatedInput
            name="deathLocation"
            label="Death Location"
            placeholder="City, State/Country"
            defaultValue={state.deathLocation}
          />
        </div>
      </motion.div>

      <AnimatedInput
        name="causeOfDeath"
        label="Cause of Death"
        placeholder="Cause of Death"
        defaultValue={state.causeOfDeath}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1 }}
      >
        {isUploading ? (
          <div className="flex items-center justify-center h-16">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : uploadComplete ? (
          <div className="flex flex-col items-center justify-center h-16">
            <Check className="h-6 w-6" />
            <span>Image Uploaded Successfully!</span>
            {/* TODO: Add replace button */}
          </div>
        ) : (
          <FileUploader
            maxFiles={1}
            accept={["image/*"]}
            maxSize={1024 * 1024 * 2}
            onFilesReady={(files) => {
              startUpload(files);
            }}
          />
        )}
        <input type="hidden" name="image" defaultValue={imageUrl!} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="flex items-center gap-2"
      >
        <Button
          type="submit"
          disabled={pending}
          className={cn("flex-1", pending && "opacity-50 cursor-not-allowed")}
        >
          {pending ? "Creating..." : "Create Profile"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setBirthDate(undefined);
            setDeathDate(undefined);
            formRef.current?.reset();
          }}
          disabled={pending}
          className={cn("flex-1", pending && "opacity-50 cursor-not-allowed")}
        >
          Reset
        </Button>
      </motion.div>
      {state.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
};
