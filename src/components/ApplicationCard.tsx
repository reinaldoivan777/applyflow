import { DeadlineBadge } from "@/components/DeadlineBadge";
import { APPLICATION_STATUSES } from "@/lib/statuses";
import type { ApplicationStatus, JobApplication } from "@/lib/types";

type ApplicationCardProps = {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (applicationId: string) => void;
  onStatusChange: (applicationId: string, status: ApplicationStatus) => void;
};

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">{application.company}</h3>
          <p className="mt-1 text-sm text-slate-600">{application.role}</p>
        </div>
        <DeadlineBadge deadline={application.deadline} />
      </div>

      <div className="mt-4 rounded-md bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Next action
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-700">{application.nextAction}</p>
      </div>

      {application.notes ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">{application.notes}</p>
      ) : null}

      <div className="mt-4 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Status
          <select
            value={application.status}
            onChange={(event) =>
              onStatusChange(application.id, event.target.value as ApplicationStatus)
            }
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-ink shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {application.jobUrl ? (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Job URL
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => onEdit(application)}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(application.id)}
            className="inline-flex items-center justify-center rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
