"use client";

import { AnimatedInput } from "@/components/elements/form/animated-input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Entry } from "@/lib/db/schema";
import type { PlacidRequest } from "@/lib/services/placid";
// import type { Deceased } from "@/lib/db/schema";
// import type { UnifiedQuote } from "@/types/quotes";
import type { ActionState } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function CreateImage({
  action,
  userId,
  deceased,
  entryId,
}: {
  action: (formData: PlacidRequest, userId: string) => Promise<ActionState>;
  userId: string | null;
  deceased: Entry;
  entryId: string;
}) {
  const [openQuotes, setOpenQuotes] = useState(false);
  const [formData, setFormData] = useState<PlacidRequest>({
    name: deceased.name,
    epitaph: "",
    citation: "",
    birth: format(deceased.dateOfBirth!, "MMMM d, yyyy"),
    death: format(deceased.dateOfDeath!, "MMMM d, yyyy"),
    portrait: deceased.image!,
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      // if (!formData.epitaph.trim()) {
      //   toast("Please enter an epitaph");
      //   return;
      // }
      const result = await action(formData, userId!);
      if (result.error) {
        setError(result.error);
        return;
      }
      startTransition(() => {
        router.push(`/${deceased.id}/images/create?id=${result.result}`);
      });
    });
  };

  return (
    <div className="w-full max-w-lg p-6 mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display deceased information */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {deceased.name}
            </h2>
            <p className="text-gray-600">
              {format(deceased.dateOfBirth!, "MMMM d, yyyy")} -{" "}
              {format(deceased.dateOfDeath!, "MMMM d, yyyy")}
            </p>
          </div>

          {/* Display the deceased's image */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={deceased.image!}
                alt={deceased.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 192px"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <AnimatedInput
            name="epitaph"
            label="Epitaph"
            type="textarea"
            value={formData.epitaph}
            onChange={handleChange}
            placeholder="Is there a quote or phrase you'd like to remember them by?"
          />
        </div>

        <AnimatedInput
          name="citation"
          label="Citation"
          value={formData.citation}
          onChange={handleChange}
          placeholder="Who said it?"
        />

        {/* Hidden inputs for the form data that's auto-populated */}
        <input type="hidden" name="name" value={formData.name} />
        <input type="hidden" name="birth" value={formData.birth} />
        <input type="hidden" name="death" value={formData.death} />
        <input type="hidden" name="portrait" value={formData.portrait} />

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button
            type="submit"
            className="flex-1 w-full sm:w-auto"
            disabled={isPending}
          >
            Generate Image
          </Button>
          <Button
            type="reset"
            variant="outline"
            className="flex-1 w-full sm:w-auto"
            onClick={() => {
              setFormData({
                name: deceased.name,
                epitaph: "",
                citation: "",
                birth: format(deceased.dateOfBirth!, "MMMM d, yyyy"),
                death: format(deceased.dateOfDeath!, "MMMM d, yyyy"),
                portrait: deceased.image!,
              });
              setError(null);
              router.replace(`/${entryId}/images/create`);
            }}
          >
            Reset
          </Button>
        </div>
        {error && <p className="text-destructive">{error}</p>}
        {/* Back to Entry Button */}
        <div className="mt-2">
          <Link
            href={`/${entryId}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
            Back to Entry
          </Link>
        </div>
      </form>
    </div>
  );
}
