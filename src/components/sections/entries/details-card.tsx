import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Entry, EntryDetails } from "@/lib/db/schema";
import { formatFamilyMembers, formatServices } from "@/lib/helpers";
import { EntryDetailsDialog } from "./details-dialog";

interface DetailsCardProps {
  entry: Entry;
  entryDetails: EntryDetails;
}

export const EntryDetailsCard = ({ entry, entryDetails }: DetailsCardProps) => {
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
        <div className="space-y-4">
          {entryDetails &&
          [
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Professional & Personal */}
                <div className="space-y-3">
                  {entryDetails.occupation && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Occupation
                      </span>
                      <p className="text-sm mt-1">{entryDetails.occupation}</p>
                    </div>
                  )}
                  {entryDetails.jobTitle && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Job Title
                      </span>
                      <p className="text-sm mt-1">{entryDetails.jobTitle}</p>
                    </div>
                  )}
                  {entryDetails.companyName && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Company
                      </span>
                      <p className="text-sm mt-1">{entryDetails.companyName}</p>
                    </div>
                  )}
                  {entryDetails.yearsWorked && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Years Worked
                      </span>
                      <p className="text-sm mt-1">{entryDetails.yearsWorked}</p>
                    </div>
                  )}
                  {entryDetails.education && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Education
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {entryDetails.education}
                      </p>
                    </div>
                  )}
                  {entryDetails.accomplishments && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Accomplishments
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {entryDetails.accomplishments}
                      </p>
                    </div>
                  )}
                  {entryDetails.hobbies && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Hobbies
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {entryDetails.hobbies}
                      </p>
                    </div>
                  )}
                  {entryDetails.personalInterests && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Personal Interests
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {entryDetails.personalInterests}
                      </p>
                    </div>
                  )}

                  {/* Military Service Section */}
                  {entryDetails.militaryService && (
                    <div className="space-y-3 pt-3 border-t">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Military Service
                        </span>
                        <p className="text-sm mt-1">Yes</p>
                      </div>
                      {entryDetails.militaryBranch && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Branch
                          </span>
                          <p className="text-sm mt-1">
                            {entryDetails.militaryBranch}
                          </p>
                        </div>
                      )}
                      {entryDetails.militaryRank && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Rank
                          </span>
                          <p className="text-sm mt-1">
                            {entryDetails.militaryRank}
                          </p>
                        </div>
                      )}
                      {entryDetails.militaryYearsServed && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Years Served
                          </span>
                          <p className="text-sm mt-1">
                            {entryDetails.militaryYearsServed}{" "}
                            {entryDetails.militaryYearsServed === 1
                              ? "year"
                              : "years"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Religious Section */}
                  {entryDetails.religious && (
                    <div className="space-y-3 pt-3 border-t">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Religious
                        </span>
                        <p className="text-sm mt-1">Yes</p>
                      </div>
                      {entryDetails.denomination && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Denomination
                          </span>
                          <p className="text-sm mt-1">
                            {entryDetails.denomination}
                          </p>
                        </div>
                      )}
                      {entryDetails.organization && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Organization
                          </span>
                          <p className="text-sm mt-1">
                            {entryDetails.organization}
                          </p>
                        </div>
                      )}
                      {entryDetails.favoriteScripture && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Favorite Scripture
                          </span>
                          <p className="text-sm mt-1 whitespace-pre-wrap italic">
                            "{entryDetails.favoriteScripture}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column - Life Story & Family */}
                <div className="space-y-3">
                  {entryDetails.biographicalSummary && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Biographical Summary
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {entryDetails.biographicalSummary}
                      </p>
                    </div>
                  )}
                  {entryDetails.familyDetails && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Family Details
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {entryDetails.familyDetails}
                      </p>
                    </div>
                  )}
                  {entryDetails.survivedBy &&
                    formatFamilyMembers(entryDetails.survivedBy) && (
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Survived By
                        </span>
                        <p className="text-sm mt-1 whitespace-pre-wrap">
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
                        <p className="text-sm mt-1 whitespace-pre-wrap">
                          {formatFamilyMembers(entryDetails.precededBy)}
                        </p>
                      </div>
                    )}
                  {entryDetails.serviceDetails &&
                    formatServices(entryDetails.serviceDetails) && (
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Service Details
                        </span>
                        <p className="text-sm mt-1 whitespace-pre-wrap">
                          {formatServices(entryDetails.serviceDetails)}
                        </p>
                      </div>
                    )}
                  {entryDetails.donationRequests && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Donation Requests
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {entryDetails.donationRequests}
                      </p>
                    </div>
                  )}
                  {entryDetails.specialAcknowledgments && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Special Acknowledgments
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {entryDetails.specialAcknowledgments}
                      </p>
                    </div>
                  )}
                  {entryDetails.additionalNotes && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Additional Notes
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {entryDetails.additionalNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add detailed information about {entry.name} to generate
              comprehensive obituaries with rich biographical details, family
              relationships, and service information.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
