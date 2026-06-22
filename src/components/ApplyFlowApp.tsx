"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ApplicationForm } from "@/components/ApplicationForm";
import { DashboardSummary } from "@/components/DashboardSummary";
import { EmptyState } from "@/components/EmptyState";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ProgressView } from "@/components/ProgressView";
import {
  deleteCloudApplication,
  getCloudApplications,
  upsertCloudApplication,
  upsertCloudApplications,
} from "@/lib/cloud-storage";
import { getDeadlineStatus } from "@/lib/deadline";
import { APPLICATION_STATUSES } from "@/lib/statuses";
import { createClient } from "@/lib/supabase/client";
import { getStoredApplications } from "@/lib/storage";
import type { ApplicationFormValues, ApplicationStatus, JobApplication } from "@/lib/types";

type ApplyFlowAppProps = {
  userId: string;
};

type DeadlineFilter = "all" | "due-soon" | "overdue";
type SortOption = "recently-updated" | "deadline";

export function ApplyFlowApp({ userId }: ApplyFlowAppProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [hasLoadedApplications, setHasLoadedApplications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>("all");
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("recently-updated");
  const [syncError, setSyncError] = useState<string | null>(null);

  const filteredApplications = useMemo(
    () =>
      filterAndSortApplications(applications, {
        searchQuery,
        statusFilter,
        deadlineFilter,
        sortOption,
      }),
    [applications, deadlineFilter, searchQuery, sortOption, statusFilter],
  );

  const hasActiveFilters =
    searchQuery.trim() || statusFilter !== "all" || deadlineFilter !== "all";

  useEffect(() => {
    let isCurrent = true;
    setHasLoadedApplications(false);
    setSyncError(null);

    loadUserApplications(userId)
      .then((loadedApplications) => {
        if (!isCurrent) {
          return;
        }

        setApplications(loadedApplications);
        setHasLoadedApplications(true);
      })
      .catch((error: unknown) => {
        if (!isCurrent) {
          return;
        }

        setSyncError(getErrorMessage(error));
        setHasLoadedApplications(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [userId]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`applications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          getCloudApplications(userId)
            .then(setApplications)
            .catch((error: unknown) => setSyncError(getErrorMessage(error)));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

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
      const updatedApplication: JobApplication = {
        ...editingApplication,
        ...normalizeFormValues(values),
        updatedAt: now,
      };

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === editingApplication.id ? updatedApplication : application,
        ),
      );
      void syncApplication(updatedApplication);
    } else {
      const newApplication: JobApplication = {
        id: crypto.randomUUID(),
        ...normalizeFormValues(values),
        createdAt: now,
        updatedAt: now,
      };

      setApplications((currentApplications) => [newApplication, ...currentApplications]);
      void syncApplication(newApplication);
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
    void deleteApplication(applicationId);
  }

  function handleStatusChange(applicationId: string, status: ApplicationStatus) {
    const currentApplication = applications.find((application) => application.id === applicationId);

    if (!currentApplication) {
      return;
    }

    const updatedApplication: JobApplication = {
      ...currentApplication,
      status,
      updatedAt: new Date().toISOString(),
    };

    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === applicationId ? updatedApplication : application,
      ),
    );
    void syncApplication(updatedApplication);
  }

  function resetFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setDeadlineFilter("all");
  }

  async function syncApplication(application: JobApplication) {
    try {
      setSyncError(null);
      await upsertCloudApplication(userId, application);
    } catch (error) {
      setSyncError(getErrorMessage(error));
    }
  }

  async function deleteApplication(applicationId: string) {
    try {
      setSyncError(null);
      await deleteCloudApplication(userId, applicationId);
    } catch (error) {
      setSyncError(getErrorMessage(error));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AppHeader onAdd={openCreateForm} />
      {syncError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {syncError}
        </div>
      ) : null}
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Cloud sync is enabled for this Google account.
      </div>
      <DashboardSummary applications={applications} />
      <ProgressView applications={applications} />

      {!hasLoadedApplications ? (
        <section className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          Loading applications...
        </section>
      ) : applications.length ? (
        <>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[minmax(16rem,1fr)_repeat(3,minmax(11rem,auto))]">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Search
                </span>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Company or role"
                  className="h-11 rounded-md border border-slate-300 px-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "all" | ApplicationStatus)
                  }
                  className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-ink outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">All statuses</option>
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Deadline
                </span>
                <select
                  value={deadlineFilter}
                  onChange={(event) => setDeadlineFilter(event.target.value as DeadlineFilter)}
                  className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-ink outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">All deadlines</option>
                  <option value="due-soon">Due soon</option>
                  <option value="overdue">Overdue</option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sort
                </span>
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value as SortOption)}
                  className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-ink outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="recently-updated">Recently updated</option>
                  <option value="deadline">Deadline</option>
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <p>
                Showing {filteredApplications.length} of {applications.length} applications
              </p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          </section>

          <KanbanBoard
            applications={filteredApplications}
            statusFilter={statusFilter}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </>
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
    </div>
  );
}

async function loadUserApplications(userId: string) {
  const cloudApplications = await getCloudApplications(userId);
  const localApplications = (getStoredApplications() ?? []).filter(
    (application) => !application.id.startsWith("sample-"),
  );

  if (cloudApplications.length || !localApplications.length) {
    return cloudApplications;
  }

  await upsertCloudApplications(userId, localApplications);
  return localApplications;
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

function filterAndSortApplications(
  applications: JobApplication[],
  filters: {
    searchQuery: string;
    statusFilter: "all" | ApplicationStatus;
    deadlineFilter: DeadlineFilter;
    sortOption: SortOption;
  },
) {
  const normalizedSearchQuery = filters.searchQuery.trim().toLowerCase();

  return applications
    .filter((application) => {
      const matchesSearch =
        !normalizedSearchQuery ||
        application.company.toLowerCase().includes(normalizedSearchQuery) ||
        application.role.toLowerCase().includes(normalizedSearchQuery);
      const matchesStatus =
        filters.statusFilter === "all" || application.status === filters.statusFilter;
      const matchesDeadline =
        filters.deadlineFilter === "all" ||
        getDeadlineStatus(application.deadline) === filters.deadlineFilter;

      return matchesSearch && matchesStatus && matchesDeadline;
    })
    .toSorted((firstApplication, secondApplication) => {
      if (filters.sortOption === "deadline") {
        return compareDeadlines(firstApplication, secondApplication);
      }

      return (
        new Date(secondApplication.updatedAt).getTime() -
        new Date(firstApplication.updatedAt).getTime()
      );
    });
}

function compareDeadlines(firstApplication: JobApplication, secondApplication: JobApplication) {
  const firstDeadlineTime = getDeadlineTime(firstApplication.deadline);
  const secondDeadlineTime = getDeadlineTime(secondApplication.deadline);

  if (firstDeadlineTime !== secondDeadlineTime) {
    return firstDeadlineTime - secondDeadlineTime;
  }

  return (
    new Date(secondApplication.updatedAt).getTime() -
    new Date(firstApplication.updatedAt).getTime()
  );
}

function getDeadlineTime(deadline?: string) {
  if (!deadline) {
    return Number.POSITIVE_INFINITY;
  }

  const deadlineTime = new Date(`${deadline}T00:00:00`).getTime();
  return Number.isNaN(deadlineTime) ? Number.POSITIVE_INFINITY : deadlineTime;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (isErrorWithMessage(error)) {
    return error.message;
  }

  return "Something went wrong while syncing.";
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.length > 0
  );
}
