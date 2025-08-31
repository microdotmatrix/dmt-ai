import { formatTime } from "./utils";

// Helper function to format family members for display
export const formatFamilyMembers = (
  data: string | null | undefined
): string => {
  if (!data || data.trim() === "") return "";

  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((member) => member && member.name && member.relationship)
        .map((member) => `${member.name} (${member.relationship})`)
        .join(", ");
    }
  } catch {
    // If parsing fails, return the original text
    return data;
  }

  return data;
};

// Helper function to format services for display
export const formatServices = (data: string | null | undefined): string => {
  if (!data || data.trim() === "") return "";

  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((service) => service && service.location)
        .map((service) => {
          const location = service.location;
          const address = service.address ? ` at ${service.address}` : "";
          const type = service.type ? `${service.type}: ` : "";

          let dateTimeInfo = "";
          if (service.date) {
            const date = new Date(service.date).toLocaleDateString();
            const timeRange =
              service.startTime && service.endTime
                ? `${formatTime(service.startTime)} - ${formatTime(
                    service.endTime
                  )}`
                : service.startTime
                ? formatTime(service.startTime)
                : service.endTime
                ? `until ${formatTime(service.endTime)}`
                : "";
            dateTimeInfo = ` on ${date}${timeRange ? ` at ${timeRange}` : ""}`;
          }

          return `${type}${location}${address}${dateTimeInfo}`;
        })
        .join("\n");
    }
  } catch {
    // If parsing fails, return the original text
    return data;
  }

  return data;
};
