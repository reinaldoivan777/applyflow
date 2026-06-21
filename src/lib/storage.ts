import { SAMPLE_APPLICATIONS } from "./sample-data";
import type { JobApplication } from "./types";

export const APPLICATION_STORAGE_KEY = "applyflow-applications";

export function getApplications(): JobApplication[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedApplications = window.localStorage.getItem(APPLICATION_STORAGE_KEY);
  if (!storedApplications) {
    saveApplications(SAMPLE_APPLICATIONS);
    return SAMPLE_APPLICATIONS;
  }

  try {
    const parsed = JSON.parse(storedApplications);
    return Array.isArray(parsed) ? parsed : SAMPLE_APPLICATIONS;
  } catch {
    return SAMPLE_APPLICATIONS;
  }
}

export function saveApplications(applications: JobApplication[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(APPLICATION_STORAGE_KEY, JSON.stringify(applications));
}

export function clearApplications() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(APPLICATION_STORAGE_KEY);
}
