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
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreateForm } from "@/lib/state";
import { CreateEntryForm } from "./create-form";
import { CreateEntryImage } from "./create-image";

export const CreatePortal = () => {
  const { open, setOpen } = useCreateForm();
  const isMobile = useIsMobile();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          Create New <Icon icon="mdi:plus" className="-mt-0.5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[90%] md:max-w-7xl max-h-[90vh] flex flex-col p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center overflow-y-auto flex-1 min-h-0 lg:overflow-y-clip p-4 lg:p-8">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <DialogHeader className="mb-8">
              <DialogTitle>Create New Entry</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new entry for the person you
                would like to commemorate. Upload a photo of them if you have
                one. You will be able to change these details later.
              </DialogDescription>
            </DialogHeader>
            <CreateEntryForm />
          </div>

          <div className="w-full md:w-1/2 lg:w-2/3">
            <CreateEntryImage />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
