import type { JobApplication } from "@/lib/types";

export function getGoogleCalendarUrl(application: JobApplication) {
  const dates = getCalendarDateRange(application.deadline);
  if (!dates) {
    return "";
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: getCalendarTitle(application),
    dates: `${dates.start}/${dates.end}`,
    details: getCalendarDescription(application),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(application: JobApplication) {
  const icsContent = buildIcsFile(application);
  if (!icsContent) {
    return;
  }

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${slugify(`${application.company}-${application.role}`)}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildIcsFile(application: JobApplication) {
  const dates = getCalendarDateRange(application.deadline);
  if (!dates) {
    return null;
  }

  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const uid = `${application.id}@applyflow`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ApplyFlow//Application Deadline//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(uid)}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${dates.start}`,
    `DTEND;VALUE=DATE:${dates.end}`,
    `SUMMARY:${escapeIcsText(getCalendarTitle(application))}`,
    `DESCRIPTION:${escapeIcsText(getCalendarDescription(application))}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function getCalendarDateRange(deadline?: string) {
  const startDate = parseDeadline(deadline);
  if (!startDate) {
    return null;
  }

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);

  return {
    start: formatDate(startDate),
    end: formatDate(endDate),
  };
}

function parseDeadline(deadline?: string) {
  if (!deadline) {
    return null;
  }

  const [year, month, day] = deadline.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

function getCalendarTitle(application: JobApplication) {
  return `${application.company}: ${application.role} deadline`;
}

function getCalendarDescription(application: JobApplication) {
  return [
    `Next action: ${application.nextAction}`,
    application.jobUrl ? `Job URL: ${application.jobUrl}` : null,
    application.notes ? `Notes: ${application.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "application-deadline";
}
