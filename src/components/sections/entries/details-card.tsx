import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Entry, EntryDetails } from "@/lib/db/schema";
import { formatFamilyMembers, formatServices } from "@/lib/helpers";
import { EntryDetailsDialog } from "./details-dialog";

interface DetailsCardProps {
  entry: Entry;
  entryDetails: EntryDetails;
  collapsible?: boolean;
}

export const EntryDetailsCard = ({
  entry,
  entryDetails,
  collapsible = false,
}: DetailsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <Icon icon="mdi:account-details" className="w-5 h-5" />
          Obituary Details
        </CardTitle>
        <EntryDetailsDialog entry={entry} initialData={entryDetails} />
      </CardHeader>
      <CardContent>
        {entryDetails ? (
          <>
            {!collapsible ? (
              <EntryDetailsSection entryDetails={entryDetails} />
            ) : (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                  <AccordionTrigger>Click here to review...</AccordionTrigger>
                  <AccordionContent>
                    <EntryDetailsSection entryDetails={entryDetails} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Add detailed information about {entry.name} to generate
            comprehensive obituaries with rich biographical details, family
            relationships, and service information.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const EntryDetailsSection = ({
  entryDetails,
}: {
  entryDetails: EntryDetails;
}) => {
  return (
    <>
      {[
        entryDetails.occupation,
        entryDetails.jobTitle,
        entryDetails.companyName,
        entryDetails.yearsWorked,
        entryDetails.education,
        entryDetails.accomplishments,
        entryDetails.biographicalSummary,
        entryDetails.hobbies,
        entryDetails.personalInterests,
        entryDetails.militaryService,
        entryDetails.militaryBranch,
        entryDetails.militaryRank,
        entryDetails.militaryYearsServed,
        entryDetails.religious,
        entryDetails.denomination,
        entryDetails.organization,
        entryDetails.favoriteScripture,
        entryDetails.familyDetails,
        entryDetails.survivedBy,
        entryDetails.precededBy,
        entryDetails.serviceDetails,
        entryDetails.donationRequests,
        entryDetails.specialAcknowledgments,
        entryDetails.additionalNotes,
      ].some(
        (value) =>
          value &&
          (typeof value === "string" ? value.trim() !== "" : value !== null)
      ) ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              {entryDetails.occupation && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Occupation
                  </span>
                  <p className="text-sm">{entryDetails.occupation}</p>
                </div>
              )}
              {entryDetails.jobTitle && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Job Title
                  </span>
                  <p className="text-sm">{entryDetails.jobTitle}</p>
                </div>
              )}
              {entryDetails.companyName && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Company
                  </span>
                  <p className="text-sm">{entryDetails.companyName}</p>
                </div>
              )}
              {entryDetails.yearsWorked && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Years Worked
                  </span>
                  <p className="text-sm">{entryDetails.yearsWorked}</p>
                </div>
              )}
              {entryDetails.accomplishments && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Accomplishments
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {entryDetails.accomplishments}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {entryDetails.education && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Education
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {entryDetails.education}
                  </p>
                </div>
              )}

              {entryDetails.hobbies && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Hobbies
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {entryDetails.hobbies}
                  </p>
                </div>
              )}
              {entryDetails.personalInterests && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Personal Interests
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {entryDetails.personalInterests}
                  </p>
                </div>
              )}
              {entryDetails.biographicalSummary && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Biographical Summary
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {entryDetails.biographicalSummary}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              {/* Military Service Section */}
              {entryDetails.militaryService && (
                <>
                  <Separator className="mb-4 mt-6" />
                  <div className="text-right -mt-7.5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Military Service
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      {entryDetails.militaryBranch && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Branch
                          </span>
                          <p className="text-sm">
                            {entryDetails.militaryBranch}
                          </p>
                        </div>
                      )}
                      {entryDetails.militaryYearsServed && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Years Served
                          </span>
                          <p className="text-sm">
                            {entryDetails.militaryYearsServed}{" "}
                            {entryDetails.militaryYearsServed === 1
                              ? "year"
                              : "years"}
                          </p>
                        </div>
                      )}
                    </div>
                    {entryDetails.militaryRank && (
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Rank
                        </span>
                        <p className="text-sm">{entryDetails.militaryRank}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              {/* Religious Section */}
              {entryDetails.religious && (
                <>
                  <Separator className="mb-4 mt-6" />
                  <div className="text-right -mt-7.5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Religion
                    </span>
                  </div>
                  <div className="space-y-2">
                    {entryDetails.denomination && (
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Denomination
                        </span>
                        <p className="text-sm">{entryDetails.denomination}</p>
                      </div>
                    )}
                    {entryDetails.organization && (
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Organization
                        </span>
                        <p className="text-sm">{entryDetails.organization}</p>
                      </div>
                    )}
                    {entryDetails.favoriteScripture && (
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Favorite Scripture
                        </span>
                        <p className="text-sm whitespace-pre-wrap italic">
                          "{entryDetails.favoriteScripture}"
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Life Story & Family */}
            <div className="space-y-2">
              {(entryDetails.survivedBy ||
                entryDetails.precededBy ||
                entryDetails.familyDetails) && (
                <>
                  <Separator className="mb-4 mt-6" />
                  <div className="text-right -mt-7.5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Family
                    </span>
                  </div>
                </>
              )}
              {entryDetails.survivedBy &&
                formatFamilyMembers(entryDetails.survivedBy) && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Survived By
                    </span>
                    <p className="text-sm whitespace-pre-wrap">
                      {formatFamilyMembers(entryDetails.survivedBy)}
                    </p>
                  </div>
                )}
              {entryDetails.precededBy &&
                formatFamilyMembers(entryDetails.precededBy) && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Preceded By
                    </span>
                    <p className="text-sm whitespace-pre-wrap">
                      {formatFamilyMembers(entryDetails.precededBy)}
                    </p>
                  </div>
                )}
              {entryDetails.familyDetails && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Other Details
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {entryDetails.familyDetails}
                  </p>
                </div>
              )}
            </div>
          </div>
          {(entryDetails.serviceDetails ||
            entryDetails.donationRequests ||
            entryDetails.specialAcknowledgments ||
            entryDetails.additionalNotes) && (
            <>
              <Separator className="mb-4 mt-6" />
              <div className="text-right -mt-7.5">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Events & Notes
                </span>
              </div>
              <div className="grid lg:grid-cols-2 gap-3">
                <div className="lg:col-span-1">
                  {entryDetails.serviceDetails &&
                    formatServices(entryDetails.serviceDetails) && (
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Service Details
                        </span>
                        <p className="text-sm whitespace-pre-wrap">
                          {formatServices(entryDetails.serviceDetails)}
                        </p>
                      </div>
                    )}
                  {entryDetails.donationRequests && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Donation Requests
                      </span>
                      <p className="text-sm whitespace-pre-wrap">
                        {entryDetails.donationRequests}
                      </p>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-1">
                  {entryDetails.specialAcknowledgments && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Special Acknowledgments
                      </span>
                      <p className="text-sm whitespace-pre-wrap">
                        {entryDetails.specialAcknowledgments}
                      </p>
                    </div>
                  )}
                  {entryDetails.additionalNotes && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Additional Notes
                      </span>
                      <p className="text-sm whitespace-pre-wrap">
                        {entryDetails.additionalNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      ) : null}
    </>
  );
};
