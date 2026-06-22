import { useState, type DragEvent } from "react";
import { ApplicationCard } from "@/components/ApplicationCard";
import type { ApplicationStatus, JobApplication } from "@/lib/types";

type KanbanColumnProps = {
  status: ApplicationStatus;
  title: string;
  description: string;
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (applicationId: string) => void;
  onDragStart: (applicationId: string) => void;
  onDragEnd: () => void;
  onDrop: (status: ApplicationStatus) => void;
};

export function KanbanColumn({
  status,
  title,
  description,
  applications,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDrop,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragOver(false);
    onDrop(status);
  }

  function handleDragLeave(event: DragEvent<HTMLElement>) {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    setIsDragOver(false);
  }

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`min-w-0 rounded-lg border p-3 transition ${
        isDragOver
          ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200 dark:bg-blue-950/50 dark:ring-blue-900"
          : "border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-950/70"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink dark:text-slate-100">{title}</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
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
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        ) : (
          <p className="rounded-md border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
            No applications in this stage.
          </p>
        )}
      </div>
    </section>
  );
}
