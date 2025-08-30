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

// Helper function to convert 24-hour time to 12-hour AM/PM format
export const formatTimeToAMPM = (time: string): string => {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? "PM" : "AM";

  return `${hour12}:${minutes} ${ampm}`;
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
                ? `${formatTimeToAMPM(service.startTime)} - ${formatTimeToAMPM(
                    service.endTime
                  )}`
                : service.startTime
                ? formatTimeToAMPM(service.startTime)
                : service.endTime
                ? `until ${formatTimeToAMPM(service.endTime)}`
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
