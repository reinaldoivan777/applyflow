import { formatDeadline, getDeadlineStatus } from "@/lib/deadline";

type DeadlineBadgeProps = {
  deadline?: string;
};

const badgeStyles = {
  none: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  overdue: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  "due-soon":
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  normal:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
};

export function DeadlineBadge({ deadline }: DeadlineBadgeProps) {
  const status = getDeadlineStatus(deadline);
  const label =
    status === "none"
      ? "No deadline"
      : status === "overdue"
        ? "Overdue"
        : status === "due-soon"
          ? "Due soon"
          : formatDeadline(deadline);

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeStyles[status]}`}
    >
      {label}
    </span>
  );
}
