type AppHeaderProps = {
  onAdd: () => void;
};

export function AppHeader({ onAdd }: AppHeaderProps) {
  return (
    <header className="flex flex-col gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          ApplyFlow
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl dark:text-slate-100">
          Track your job search from applied to offer.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">
          A lightweight Kanban board for developers managing applications, interviews,
          take-home tests, and follow-ups.
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex shrink-0 items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Application
      </button>
    </header>
  );
}
