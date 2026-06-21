export type DeadlineStatus = "none" | "overdue" | "due-soon" | "normal";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function parseLocalDate(deadline?: string) {
  if (!deadline) {
    return null;
  }

  const [year, month, day] = deadline.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

export function getDeadlineStatus(deadline?: string): DeadlineStatus {
  const date = parseLocalDate(deadline);
  if (!date) {
    return "none";
  }

  const today = startOfToday();
  const daysUntilDeadline = Math.ceil((date.getTime() - today.getTime()) / DAY_IN_MS);

  if (daysUntilDeadline < 0) {
    return "overdue";
  }

  if (daysUntilDeadline <= 3) {
    return "due-soon";
  }

  return "normal";
}

export function formatDeadline(deadline?: string) {
  const date = parseLocalDate(deadline);
  if (!date) {
    return "No deadline";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function isDueSoon(deadline?: string) {
  return getDeadlineStatus(deadline) === "due-soon";
}
