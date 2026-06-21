import { useState } from "react";
import { KanbanColumn } from "@/components/KanbanColumn";
import { APPLICATION_STATUSES } from "@/lib/statuses";
import type { ApplicationStatus, JobApplication } from "@/lib/types";

type KanbanBoardProps = {
  applications: JobApplication[];
  statusFilter?: "all" | ApplicationStatus;
  onEdit: (application: JobApplication) => void;
  onDelete: (applicationId: string) => void;
  onStatusChange: (applicationId: string, status: ApplicationStatus) => void;
};

export function KanbanBoard({
  applications,
  statusFilter = "all",
  onEdit,
  onDelete,
  onStatusChange,
}: KanbanBoardProps) {
  const [draggedApplicationId, setDraggedApplicationId] = useState<string | null>(null);
  const visibleStatuses =
    statusFilter === "all"
      ? APPLICATION_STATUSES
      : APPLICATION_STATUSES.filter((status) => status.value === statusFilter);

  function handleDrop(status: ApplicationStatus) {
    if (!draggedApplicationId) {
      return;
    }

    const draggedApplication = applications.find(
      (application) => application.id === draggedApplicationId,
    );

    if (draggedApplication && draggedApplication.status !== status) {
      onStatusChange(draggedApplicationId, status);
    }

    setDraggedApplicationId(null);
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[repeat(6,minmax(18rem,1fr))] lg:overflow-x-auto lg:pb-2">
      {visibleStatuses.map((status) => (
        <KanbanColumn
          key={status.value}
          status={status.value}
          title={status.label}
          description={status.description}
          applications={applications.filter((application) => application.status === status.value)}
          onEdit={onEdit}
          onDelete={onDelete}
          onDragStart={setDraggedApplicationId}
          onDragEnd={() => setDraggedApplicationId(null)}
          onDrop={handleDrop}
        />
      ))}
    </section>
  );
}
