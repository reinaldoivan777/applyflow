export type ApplicationStatus =
  | "applied"
  | "screening"
  | "interview"
  | "take-home"
  | "offer"
  | "rejected";

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  jobUrl?: string;
  status: ApplicationStatus;
  deadline?: string;
  nextAction: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationFormValues = {
  company: string;
  role: string;
  jobUrl: string;
  status: ApplicationStatus;
  deadline: string;
  nextAction: string;
  notes: string;
};
