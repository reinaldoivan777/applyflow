import { KanbanColumn } from "@/components/KanbanColumn";
import { APPLICATION_STATUSES } from "@/lib/statuses";
import type { ApplicationStatus, JobApplication } from "@/lib/types";

type KanbanBoardProps = {
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (applicationId: string) => void;
  onStatusChange: (applicationId: string, status: ApplicationStatus) => void;
};

export function KanbanBoard({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
}: KanbanBoardProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[repeat(6,minmax(18rem,1fr))] lg:overflow-x-auto lg:pb-2">
      {APPLICATION_STATUSES.map((status) => (
        <KanbanColumn
          key={status.value}
          title={status.label}
          description={status.description}
          applications={applications.filter((application) => application.status === status.value)}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </section>
  );
}
