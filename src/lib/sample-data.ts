import type { JobApplication } from "./types";

const now = new Date().toISOString();

export const SAMPLE_APPLICATIONS: JobApplication[] = [
  {
    id: "sample-1",
    company: "Northstar Labs",
    role: "Frontend Engineer",
    jobUrl: "https://example.com/jobs/frontend-engineer",
    status: "applied",
    nextAction: "Follow up with recruiter",
    notes: "React-heavy product role with a small platform team.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sample-2",
    company: "OrbitPay",
    role: "Full Stack Developer",
    status: "interview",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    nextAction: "Prepare system design examples",
    notes: "Next round covers architecture and API design.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sample-3",
    company: "PixelForge",
    role: "Product Engineer",
    status: "take-home",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    nextAction: "Finish take-home submission",
    createdAt: now,
    updatedAt: now,
  },
];
