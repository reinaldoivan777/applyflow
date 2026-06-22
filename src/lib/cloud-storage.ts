import { createClient } from "@/lib/supabase/client";
import type { ApplicationStatus, JobApplication } from "@/lib/types";

const APPLICATIONS_TABLE = "applications";

type ApplicationRow = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  job_url: string | null;
  status: ApplicationStatus;
  deadline: string | null;
  next_action: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function getCloudApplications(userId: string) {
  const { data, error } = await createClient()
    .from(APPLICATIONS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(fromRow);
}

export async function upsertCloudApplication(userId: string, application: JobApplication) {
  const { error } = await createClient()
    .from(APPLICATIONS_TABLE)
    .upsert(toRow(userId, application), { onConflict: "id" });

  if (error) {
    throw error;
  }
}

export async function upsertCloudApplications(userId: string, applications: JobApplication[]) {
  if (!applications.length) {
    return;
  }

  const { error } = await createClient()
    .from(APPLICATIONS_TABLE)
    .upsert(applications.map((application) => toRow(userId, application)), { onConflict: "id" });

  if (error) {
    throw error;
  }
}

export async function deleteCloudApplication(userId: string, applicationId: string) {
  const { error } = await createClient()
    .from(APPLICATIONS_TABLE)
    .delete()
    .eq("id", applicationId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

function fromRow(row: ApplicationRow): JobApplication {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    jobUrl: row.job_url ?? undefined,
    status: row.status,
    deadline: row.deadline ?? undefined,
    nextAction: row.next_action,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(userId: string, application: JobApplication): ApplicationRow {
  return {
    id: application.id,
    user_id: userId,
    company: application.company,
    role: application.role,
    job_url: application.jobUrl ?? null,
    status: application.status,
    deadline: application.deadline ?? null,
    next_action: application.nextAction,
    notes: application.notes ?? null,
    created_at: application.createdAt,
    updated_at: application.updatedAt,
  };
}
