import { ApplicationCard } from "@/components/ApplicationCard";
import type { ApplicationStatus, JobApplication } from "@/lib/types";

type KanbanColumnProps = {
  title: string;
  description: string;
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (applicationId: string) => void;
  onStatusChange: (applicationId: string, status: ApplicationStatus) => void;
};

export function KanbanColumn({
  title,
  description,
  applications,
  onEdit,
  onDelete,
  onStatusChange,
}: KanbanColumnProps) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-slate-100/70 p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
          {applications.length}
        </span>
      </div>

      <div className="grid gap-3">
        {applications.length ? (
          applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <p className="rounded-md border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-slate-500">
            No applications in this stage.
          </p>
        )}
      </div>
    </section>
  );
}
