"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { updateEntryDetailsDirectAction } from "@/lib/db/actions/entries";
import { Entry } from "@/lib/db/schema";
import { useEntryDetailsForm } from "@/lib/state";
import { EntryDetailsForm } from "./details-form";

export const EntryDetailsDialog = ({
  entry,
  initialData,
}: {
  entry: Entry;
  initialData?: any;
}) => {
  const { openDetails, setOpenDetails } = useEntryDetailsForm();

  const handleObituarySubmit = async (data: any) => {
    await updateEntryDetailsDirectAction(entry.id, data);
    setOpenDetails(true);
  };

  return (
    <Dialog open={openDetails} onOpenChange={setOpenDetails}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <Icon
            icon={
              initialData && Object.keys(initialData).length > 0
                ? "mdi:pencil"
                : "mdi:plus"
            }
            className="w-4 h-4 mr-2"
          />
          {initialData && Object.keys(initialData).length > 0
            ? "Edit Details"
            : "Add Details"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-4xl max-h-[90vh] h-full overflow-y-auto p-0"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--color-accent) transparent",
        }}
      >
        <DialogHeader className="pt-8">
          <DialogTitle className="sr-only">Biography: {entry.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Fill out the form below to complete the obituary details for{" "}
            {entry.name}.
          </DialogDescription>
        </DialogHeader>
        <EntryDetailsForm
          initialData={initialData}
          onSubmit={handleObituarySubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
