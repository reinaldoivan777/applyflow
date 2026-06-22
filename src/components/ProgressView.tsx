"use client";

import { useMemo, useState } from "react";
import type { JobApplication } from "@/lib/types";

type ProgressPeriod = "weekly" | "monthly";

type ProgressViewProps = {
  applications: JobApplication[];
};

export function ProgressView({ applications }: ProgressViewProps) {
  const [period, setPeriod] = useState<ProgressPeriod>("weekly");
  const stats = useMemo(
    () => getProgressStats(applications, period),
    [applications, period],
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink dark:text-slate-100">Progress</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track application activity by week or month.
          </p>
        </div>

        <div className="inline-flex rounded-md border border-slate-300 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
          {(["weekly", "monthly"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPeriod(option)}
              className={`rounded px-3 py-1.5 text-sm font-semibold capitalize transition ${
                period === option
                  ? "bg-white text-ink shadow-sm dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-600 hover:text-ink dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-md bg-slate-50 p-3 dark:bg-slate-950">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-ink dark:text-slate-100">{stat.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function getProgressStats(applications: JobApplication[], period: ProgressPeriod) {
  const periodStart = getPeriodStart(period);
  const wasCreatedInPeriod = (application: JobApplication) =>
    new Date(application.createdAt).getTime() >= periodStart.getTime();
  const wasUpdatedInPeriod = (application: JobApplication) =>
    new Date(application.updatedAt).getTime() >= periodStart.getTime();

  return [
    {
      label: "Applications added",
      value: applications.filter(wasCreatedInPeriod).length,
    },
    {
      label: "Interviews",
      value: applications.filter(
        (application) =>
          application.status === "interview" && wasUpdatedInPeriod(application),
      ).length,
    },
    {
      label: "Take-home tests",
      value: applications.filter(
        (application) =>
          application.status === "take-home" && wasUpdatedInPeriod(application),
      ).length,
    },
    {
      label: "Rejected",
      value: applications.filter(
        (application) =>
          application.status === "rejected" && wasUpdatedInPeriod(application),
      ).length,
    },
    {
      label: "Offers",
      value: applications.filter(
        (application) =>
          application.status === "offer" && wasUpdatedInPeriod(application),
      ).length,
    },
  ];
}

function getPeriodStart(period: ProgressPeriod) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  if (period === "monthly") {
    date.setDate(1);
    return date;
  }

  const mondayOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - mondayOffset);
  return date;
}
