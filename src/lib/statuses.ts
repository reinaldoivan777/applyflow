import type { ApplicationStatus } from "./types";

export const APPLICATION_STATUSES = [
  {
    value: "applied",
    label: "Applied",
    description: "Submitted applications",
  },
  {
    value: "screening",
    label: "Screening",
    description: "Recruiter or initial review",
  },
  {
    value: "interview",
    label: "Interview",
    description: "Technical or culture interview",
  },
  {
    value: "take-home",
    label: "Take-home",
    description: "Assignments or coding tests",
  },
  {
    value: "offer",
    label: "Offer",
    description: "Offer or negotiation stage",
  },
  {
    value: "rejected",
    label: "Rejected",
    description: "Closed or rejected applications",
  },
] as const satisfies ReadonlyArray<{
  value: ApplicationStatus;
  label: string;
  description: string;
}>;
