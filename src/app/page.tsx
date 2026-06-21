"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ApplicationForm } from "@/components/ApplicationForm";
import { DashboardSummary } from "@/components/DashboardSummary";
import { EmptyState } from "@/components/EmptyState";
import { KanbanBoard } from "@/components/KanbanBoard";
import { getApplications, saveApplications } from "@/lib/storage";
import type { ApplicationFormValues, ApplicationStatus, JobApplication } from "@/lib/types";

export default function Home() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setApplications(getApplications());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      saveApplications(applications);
    }
  }, [applications, hasLoaded]);

  function openCreateForm() {
    setEditingApplication(null);
    setIsFormOpen(true);
  }

  function openEditForm(application: JobApplication) {
    setEditingApplication(application);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingApplication(null);
  }

  function handleSubmit(values: ApplicationFormValues) {
    const now = new Date().toISOString();

    if (editingApplication) {
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === editingApplication.id
            ? {
                ...application,
                ...normalizeFormValues(values),
                updatedAt: now,
              }
            : application,
        ),
      );
    } else {
      setApplications((currentApplications) => [
        {
          id: crypto.randomUUID(),
          ...normalizeFormValues(values),
          createdAt: now,
          updatedAt: now,
        },
        ...currentApplications,
      ]);
    }

    closeForm();
  }

  function handleDelete(applicationId: string) {
    const shouldDelete = window.confirm("Delete this application?");
    if (!shouldDelete) {
      return;
    }

    setApplications((currentApplications) =>
      currentApplications.filter((application) => application.id !== applicationId),
    );
  }

  function handleStatusChange(applicationId: string, status: ApplicationStatus) {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              status,
              updatedAt: new Date().toISOString(),
            }
          : application,
      ),
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[118rem] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <AppHeader onAdd={openCreateForm} />
      <DashboardSummary applications={applications} />

      {applications.length ? (
        <KanbanBoard
          applications={applications}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <EmptyState onAdd={openCreateForm} />
      )}

      {isFormOpen ? (
        <ApplicationForm
          application={editingApplication}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      ) : null}
    </main>
  );
}

function normalizeFormValues(values: ApplicationFormValues) {
  return {
    company: values.company,
    role: values.role,
    jobUrl: values.jobUrl || undefined,
    status: values.status,
    deadline: values.deadline || undefined,
    nextAction: values.nextAction,
    notes: values.notes || undefined,
  };
}
