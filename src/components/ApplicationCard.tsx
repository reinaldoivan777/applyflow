import { DeadlineBadge } from "@/components/DeadlineBadge";
import type { DragEvent } from "react";
import { downloadIcsFile, getGoogleCalendarUrl } from "@/lib/calendar";
import type { JobApplication } from "@/lib/types";

type ApplicationCardProps = {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (applicationId: string) => void;
  onDragStart: (applicationId: string) => void;
  onDragEnd: () => void;
};

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: ApplicationCardProps) {
  const googleCalendarUrl = getGoogleCalendarUrl(application);

  function handleDragStart(event: DragEvent<HTMLElement>) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", application.id);
    onDragStart(application.id);
  }

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className="cursor-grab rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md active:cursor-grabbing dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900"
      aria-label={`${application.company} ${application.role}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink dark:text-slate-100">{application.company}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{application.role}</p>
        </div>
        <DeadlineBadge deadline={application.deadline} />
      </div>

      <div className="mt-4 rounded-md bg-slate-50 p-3 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Next action
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {application.nextAction}
        </p>
      </div>

      {application.notes ? (
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {application.notes}
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {googleCalendarUrl ? (
            <>
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950"
              >
                Add to Google Calendar
              </a>
              <button
                type="button"
                onClick={() => downloadIcsFile(application)}
                className="inline-flex items-center justify-center rounded-md border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950"
              >
                Download .ics file
              </button>
            </>
          ) : null}
          {application.jobUrl ? (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Job URL
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => onEdit(application)}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(application.id)}
            className="inline-flex items-center justify-center rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
