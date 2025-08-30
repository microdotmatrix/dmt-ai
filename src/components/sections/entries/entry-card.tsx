import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Entry } from "@/lib/db/schema";
import Image from "next/image";

interface EntryCardProps {
  entry: Entry;
}

export const EntryCard = ({ entry }: EntryCardProps) => {
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon icon="mdi:account" className="w-5 h-5" />
          {entry.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Profile Image */}
          {entry.image && (
            <div className="flex justify-center">
              <div className="relative size-48 rounded-full overflow-hidden border-2 border-muted">
                <Image
                  src={entry.image}
                  alt={`${entry.name} portrait`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Key Information */}
          <div className="space-y-3">
            {/* Birth Date */}
            {entry.dateOfBirth && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Born
                </span>
                <p className="text-sm mt-1">
                  {formatDate(entry.dateOfBirth)}
                  {entry.locationBorn && ` in ${entry.locationBorn}`}
                </p>
              </div>
            )}

            {/* Death Date */}
            {entry.dateOfDeath && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Died
                </span>
                <p className="text-sm mt-1">
                  {formatDate(entry.dateOfDeath)}
                  {entry.locationDied && ` in ${entry.locationDied}`}
                </p>
              </div>
            )}

            {/* Cause of Death */}
            {entry.causeOfDeath && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Cause
                </span>
                <p className="text-sm mt-1">{entry.causeOfDeath}</p>
              </div>
            )}

            {/* Age at Death (if both dates available) */}
            {entry.dateOfBirth && entry.dateOfDeath && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Age
                </span>
                <p className="text-sm mt-1">
                  {Math.floor(
                    (new Date(entry.dateOfDeath).getTime() -
                      new Date(entry.dateOfBirth).getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000)
                  )}{" "}
                  years old
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
