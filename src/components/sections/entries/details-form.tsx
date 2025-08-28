"use client";

import { AnimatedInput } from "@/components/elements/form/animated-input";
import Stepper, { Step } from "@/components/elements/multi-step";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-picker";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatTime } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface ObituaryFormData {
  // Biographical details
  occupation?: string;
  jobTitle?: string;
  companyName?: string;
  yearsWorked?: string;
  education?: string;
  accomplishments?: string;
  biographicalSummary?: string;
  hobbies?: string;
  personalInterests?: string;

  // Family and relationships
  familyDetails?: string;
  survivedBy?: FamilyMember[];
  precededBy?: FamilyMember[];

  // Service details and additional information
  serviceDetails?: Service[];
  donationRequests?: string;
  specialAcknowledgments?: string;
  additionalNotes?: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  location?: string;
}

interface Service {
  id: string;
  location: string;
  address: string;
  date?: Date;
  startTime?: string;
  endTime?: string;
}

// Helper functions for serialization/deserialization
const serializeFamilyMembers = (
  members: FamilyMember[] | undefined
): string | undefined => {
  if (!members || members.length === 0) return undefined;
  try {
    return JSON.stringify(members);
  } catch {
    return undefined;
  }
};

const deserializeFamilyMembers = (data: string | undefined): FamilyMember[] => {
  if (!data || data.trim() === "") return [];
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (member) =>
          member &&
          typeof member === "object" &&
          typeof member.id === "string" &&
          typeof member.name === "string" &&
          typeof member.relationship === "string"
      );
    }
  } catch {
    // If parsing fails, treat as legacy text format and create a single member
    return [
      {
        id: Date.now().toString(),
        name: data.trim(),
        relationship: "Family member",
      },
    ];
  }
  return [];
};

const serializeServices = (
  services: Service[] | undefined
): string | undefined => {
  if (!services || services.length === 0) return undefined;
  try {
    // Convert Date objects to ISO strings for serialization
    const serializedServices = services.map((service) => ({
      ...service,
      date: service.date ? service.date.toISOString() : undefined,
    }));
    return JSON.stringify(serializedServices);
  } catch {
    return undefined;
  }
};

const deserializeServices = (data: string | undefined): Service[] => {
  if (!data || data.trim() === "") return [];
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed
        .filter(
          (service) =>
            service &&
            typeof service === "object" &&
            typeof service.id === "string" &&
            typeof service.location === "string" &&
            typeof service.address === "string"
        )
        .map((service) => ({
          ...service,
          date: service.date ? new Date(service.date) : undefined,
          startTime: service.startTime || "",
          endTime: service.endTime || "",
        }));
    }
  } catch {
    // If parsing fails, treat as legacy text format - don't create a service from plain text
    return [];
  }
  return [];
};

interface ObituaryFormProps {
  initialData?: Partial<any>; // Allow initial data to have string format from DB
  onSubmit: (data: any) => Promise<void>; // Allow serialized data to be passed
  onCancel?: () => void;
}

export const EntryDetailsForm = ({
  initialData = {},
  onSubmit,
  onCancel,
}: ObituaryFormProps) => {
  // Process initial data to convert string fields to arrays for family members and services
  const processedInitialData: ObituaryFormData = {
    ...initialData,
    survivedBy: deserializeFamilyMembers(initialData?.survivedBy),
    precededBy: deserializeFamilyMembers(initialData?.precededBy),
    serviceDetails: deserializeServices(initialData?.serviceDetails),
  };

  const [formData, setFormData] =
    useState<ObituaryFormData>(processedInitialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const updateFormData = (updates: Partial<ObituaryFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const addFamilyMember = (type: "survivedBy" | "precededBy") => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: "",
      relationship: "",
    };

    setFormData((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), newMember],
    }));
  };

  const updateFamilyMember = (
    type: "survivedBy" | "precededBy",
    id: string,
    field: keyof FamilyMember,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type]?.map((member: FamilyMember) =>
        member.id === id ? { ...member, [field]: value } : member
      ),
    }));
  };

  const removeFamilyMember = (
    type: "survivedBy" | "precededBy",
    id: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type]?.filter((member: FamilyMember) => member.id !== id),
    }));
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      location: "",
      address: "",
      date: undefined,
      startTime: "",
      endTime: "",
    };

    setFormData((prev) => ({
      ...prev,
      serviceDetails: [...(prev.serviceDetails || []), newService],
    }));
  };

  const updateService = (
    id: string,
    field: keyof Service,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      serviceDetails: prev.serviceDetails?.map((service: Service) =>
        service.id === id ? { ...service, [field]: value } : service
      ),
    }));
  };

  const removeService = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceDetails: prev.serviceDetails?.filter(
        (service: Service) => service.id !== id
      ),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      startTransition(async () => {
        // Serialize family member arrays and services to strings before submitting
        const serializedFormData = {
          ...formData,
          survivedBy: serializeFamilyMembers(formData.survivedBy),
          precededBy: serializeFamilyMembers(formData.precededBy),
          serviceDetails: serializeServices(formData.serviceDetails),
        };
        await onSubmit(serializedFormData);
        startTransition(() => {
          router.refresh();
        });
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    await handleSubmit();
  };

  const saveProgressButton = (
    <Button
      type="button"
      onClick={handleSave}
      disabled={isSubmitting || isPending}
      variant="outline"
    >
      {isSubmitting || isPending ? "Saving..." : "Save Progress"}
    </Button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Stepper
        onFinalStepCompleted={handleSubmit}
        nextButtonProps={{ disabled: isSubmitting || isPending }}
        backButtonProps={{ disabled: isSubmitting || isPending }}
        centerButton={saveProgressButton}
        contentClassName="min-h-96"
      >
        {/* Step 1: Biographical Details */}
        <Step>
          <BiographicalDetailsStep data={formData} onChange={updateFormData} />
        </Step>

        {/* Step 2: Family and Relationships */}
        <Step>
          <FamilyRelationshipsStep
            data={formData}
            onChange={updateFormData}
            addFamilyMember={addFamilyMember}
            updateFamilyMember={updateFamilyMember}
            removeFamilyMember={removeFamilyMember}
          />
        </Step>

        {/* Step 3: Service Details and Additional Information */}
        <Step>
          <ServiceDetailsStep
            data={formData}
            onChange={updateFormData}
            onCancel={onCancel}
            addService={addService}
            updateService={updateService}
            removeService={removeService}
          />
        </Step>
      </Stepper>
    </div>
  );
};

interface StepProps {
  data: ObituaryFormData;
  onChange: (updates: Partial<ObituaryFormData>) => void;
  addFamilyMember?: (type: "survivedBy" | "precededBy") => void;
  updateFamilyMember?: (
    type: "survivedBy" | "precededBy",
    id: string,
    field: keyof FamilyMember,
    value: string
  ) => void;
  removeFamilyMember?: (type: "survivedBy" | "precededBy", id: string) => void;
  addService?: () => void;
  updateService?: (
    id: string,
    field: keyof Service,
    value: string | Date | undefined
  ) => void;
  removeService?: (id: string) => void;
}

const BiographicalDetailsStep = ({ data, onChange }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Biographical Details
        </h3>
        <p className="text-sm text-muted-foreground">
          Tell us about their career, education, and life story
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatedInput
          label="Occupation"
          name="occupation"
          controlled={true}
          value={data.occupation || ""}
          onChange={(e) => onChange({ occupation: e.target.value })}
          placeholder="e.g., Teacher, Engineer, Artist"
        />

        <AnimatedInput
          label="Job Title"
          name="jobTitle"
          controlled={true}
          value={data.jobTitle || ""}
          onChange={(e) => onChange({ jobTitle: e.target.value })}
          placeholder="e.g., Senior Software Engineer"
        />

        <AnimatedInput
          label="Company/Organization"
          name="companyName"
          controlled={true}
          value={data.companyName || ""}
          onChange={(e) => onChange({ companyName: e.target.value })}
          placeholder="e.g., ABC Corporation"
        />

        <AnimatedInput
          label="Years Worked"
          name="yearsWorked"
          controlled={true}
          value={data.yearsWorked || ""}
          onChange={(e) => onChange({ yearsWorked: e.target.value })}
          placeholder="e.g., 1985-2010 or 25 years"
        />
      </div>

      <AnimatedInput
        label="Education"
        name="education"
        type="textarea"
        controlled={true}
        value={data.education || ""}
        onChange={(e) => onChange({ education: e.target.value })}
        placeholder="Schools attended, degrees earned, academic achievements..."
        className="h-24"
      />

      <AnimatedInput
        label="Accomplishments & Achievements"
        name="accomplishments"
        type="textarea"
        controlled={true}
        value={data.accomplishments || ""}
        onChange={(e) => onChange({ accomplishments: e.target.value })}
        placeholder="Awards, recognitions, career highlights..."
        className="h-24"
      />

      <AnimatedInput
        label="Biographical Summary"
        name="biographicalSummary"
        type="textarea"
        controlled={true}
        value={data.biographicalSummary || ""}
        onChange={(e) => onChange({ biographicalSummary: e.target.value })}
        placeholder="A brief overview of their life story, character, and what made them special..."
        className="h-24"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatedInput
          label="Hobbies"
          name="hobbies"
          type="textarea"
          controlled={true}
          value={data.hobbies || ""}
          onChange={(e) => onChange({ hobbies: e.target.value })}
          placeholder="Activities they enjoyed in their free time..."
        />

        <AnimatedInput
          label="Personal Interests"
          name="personalInterests"
          type="textarea"
          controlled={true}
          value={data.personalInterests || ""}
          onChange={(e) => onChange({ personalInterests: e.target.value })}
          placeholder="Passions, causes they cared about, special interests..."
        />
      </div>
    </div>
  );
};

const FamilyRelationshipsStep = ({
  data,
  onChange,
  addFamilyMember,
  updateFamilyMember,
  removeFamilyMember,
}: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Family & Relationships
        </h3>
        <p className="text-sm text-muted-foreground">
          Share information about their family, close friends, and loved ones.
        </p>
      </div>

      <FamilyMemberInputs
        type="survivedBy"
        formData={data}
        onChange={onChange}
        addFamilyMember={addFamilyMember}
        updateFamilyMember={updateFamilyMember}
        removeFamilyMember={removeFamilyMember}
      />

      <FamilyMemberInputs
        type="precededBy"
        formData={data}
        onChange={onChange}
        addFamilyMember={addFamilyMember}
        updateFamilyMember={updateFamilyMember}
        removeFamilyMember={removeFamilyMember}
      />

      <AnimatedInput
        label="Family Details"
        name="familyDetails"
        type="textarea"
        controlled={true}
        value={data.familyDetails || ""}
        onChange={(e) => onChange({ familyDetails: e.target.value })}
        placeholder="Any other relevant details about their family, close friends, or colleagues..."
        className="h-24"
      />
    </div>
  );
};

const FamilyMemberInputs = ({
  type,
  formData,
  onChange,
  addFamilyMember,
  updateFamilyMember,
  removeFamilyMember,
}: {
  type: "survivedBy" | "precededBy";
  formData: ObituaryFormData;
  onChange: (data: ObituaryFormData) => void;
  addFamilyMember?: (type: "survivedBy" | "precededBy") => void;
  updateFamilyMember?: (
    type: "survivedBy" | "precededBy",
    id: string,
    field: keyof FamilyMember,
    value: string
  ) => void;
  removeFamilyMember?: (type: "survivedBy" | "precededBy", id: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="survivedBy">
          {type === "survivedBy" ? "Survived By" : "PrecededBy"}
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addFamilyMember?.(type)}
        >
          <Icon icon="lucide:plus" className="h-4 w-4 mr-2" />
          Add Person
        </Button>
      </div>

      {formData[type]?.map((member: FamilyMember) => (
        <div
          key={member.id}
          className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 border rounded-lg"
        >
          <Input
            name="name"
            placeholder="Name"
            value={member.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFamilyMember?.(type, member.id, "name", e.target.value)
            }
          />
          <Input
            name="relationship"
            placeholder="Relationship"
            value={member.relationship}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFamilyMember?.(
                type,
                member.id,
                "relationship",
                e.target.value
              )
            }
          />
          <Button
            type="button"
            variant="outline"
            className="w-full lg:w-fit"
            onClick={() => removeFamilyMember?.(type, member.id)}
          >
            <Icon icon="lucide:trash" className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

const ServiceInputs = ({
  formData,
  addService,
  updateService,
  removeService,
}: {
  formData: ObituaryFormData;
  addService?: () => void;
  updateService?: (
    id: string,
    field: keyof Service,
    value: string | Date | undefined
  ) => void;
  removeService?: (id: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="serviceDetails">Service Details</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addService?.()}
        >
          <Icon icon="lucide:plus" className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {formData.serviceDetails?.map((service: Service) => (
        <div
          key={service.id}
          className="flex flex-col gap-4 p-4 border rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="location"
              placeholder="Service Location"
              value={service.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateService?.(service.id, "location", e.target.value)
              }
            />
            <Input
              name="address"
              placeholder="Address"
              value={service.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateService?.(service.id, "address", e.target.value)
              }
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !service.date && "text-muted-foreground"
                    )}
                  >
                    <Icon icon="lucide:calendar" className="mr-2 h-4 w-4" />
                    {service.date ? (
                      `${format(service.date, "PPP")} ${
                        service.startTime
                          ? `${formatTime(service.startTime)}`
                          : ""
                      }${service.startTime && service.endTime ? " - " : ""}${
                        service.endTime ? `${formatTime(service.endTime)}` : ""
                      }`
                    ) : (
                      <span>Pick date and time</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <DateTimePicker
                    date={service.date}
                    startTime={service.startTime}
                    endTime={service.endTime}
                    setDate={(date: Date) =>
                      updateService?.(service.id, "date", date)
                    }
                    setStartTime={(time: string) =>
                      updateService?.(service.id, "startTime", time)
                    }
                    setEndTime={(time: string) =>
                      updateService?.(service.id, "endTime", time)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeService?.(service.id)}
            >
              <Icon icon="lucide:trash" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

interface ServiceDetailsStepProps extends StepProps {
  onCancel?: () => void;
}

const ServiceDetailsStep = ({
  data,
  onChange,
  onCancel,
  addService,
  updateService,
  removeService,
}: ServiceDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Service Details & Additional Information
        </h3>
        <p className="text-sm text-muted-foreground">
          Final details about services and any additional information
        </p>
      </div>

      <ServiceInputs
        formData={data}
        addService={addService}
        updateService={updateService}
        removeService={removeService}
      />

      <AnimatedInput
        label="Donation Requests"
        name="donationRequests"
        type="textarea"
        controlled={true}
        value={data.donationRequests || ""}
        onChange={(e) => onChange({ donationRequests: e.target.value })}
        placeholder="Preferred charities or causes for donations in lieu of flowers..."
      />

      <AnimatedInput
        label="Special Acknowledgments"
        name="specialAcknowledgments"
        type="textarea"
        controlled={true}
        value={data.specialAcknowledgments || ""}
        onChange={(e) => onChange({ specialAcknowledgments: e.target.value })}
        placeholder="Thank you messages, special mentions to caregivers, friends, or organizations..."
      />

      <AnimatedInput
        label="Additional Notes"
        name="additionalNotes"
        type="textarea"
        controlled={true}
        value={data.additionalNotes || ""}
        onChange={(e) => onChange({ additionalNotes: e.target.value })}
        placeholder="Any other relevant information you'd like to include in the obituary..."
        className="h-24"
      />

      {/* Cancel Button */}
      {onCancel && (
        <div className="flex justify-center pt-4 border-t">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
