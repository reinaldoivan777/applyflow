import { isDueSoon } from "@/lib/deadline";
import type { JobApplication } from "@/lib/types";

type DashboardSummaryProps = {
  applications: JobApplication[];
};

export function DashboardSummary({ applications }: DashboardSummaryProps) {
  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
    },
    {
      label: "Active Processes",
      value: applications.filter(
        (application) =>
          application.status !== "offer" && application.status !== "rejected",
      ).length,
    },
    {
      label: "Due Soon",
      value: applications.filter((application) =>
        isDueSoon(application.deadline),
      ).length,
    },
    {
      label: "Offers",
      value: applications.filter(
        (application) => application.status === "offer",
      ).length,
    },
  ];

  return (
    <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold text-ink dark:text-slate-100">{stat.value}</p>
        </article>
      ))}
    </section>
  );
}
