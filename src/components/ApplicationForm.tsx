import { FormEvent, useEffect, useState } from "react";
import { APPLICATION_STATUSES } from "@/lib/statuses";
import type { ApplicationFormValues, JobApplication } from "@/lib/types";

type ApplicationFormProps = {
  application?: JobApplication | null;
  onCancel: () => void;
  onSubmit: (values: ApplicationFormValues) => void;
};

const emptyForm: ApplicationFormValues = {
  company: "",
  role: "",
  jobUrl: "",
  status: "applied",
  deadline: "",
  nextAction: "",
  notes: "",
};

function isValidJobUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ApplicationForm({ application, onCancel, onSubmit }: ApplicationFormProps) {
  const [values, setValues] = useState<ApplicationFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!application) {
      setValues(emptyForm);
      setErrors({});
      return;
    }

    setValues({
      company: application.company,
      role: application.role,
      jobUrl: application.jobUrl ?? "",
      status: application.status,
      deadline: application.deadline ?? "",
      nextAction: application.nextAction,
      notes: application.notes ?? "",
    });
    setErrors({});
  }, [application]);

  function updateValue<Key extends keyof ApplicationFormValues>(
    key: Key,
    value: ApplicationFormValues[Key],
  ) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!values.company.trim()) {
      nextErrors.company = "Company name is required.";
    }

    if (!values.role.trim()) {
      nextErrors.role = "Role is required.";
    }

    if (!values.nextAction.trim()) {
      nextErrors.nextAction = "Next action is required.";
    }

    if (!isValidJobUrl(values.jobUrl.trim())) {
      nextErrors.jobUrl = "Enter a valid job URL starting with http:// or https://.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      company: values.company.trim(),
      role: values.role.trim(),
      jobUrl: values.jobUrl.trim(),
      status: values.status,
      deadline: values.deadline,
      nextAction: values.nextAction.trim(),
      notes: values.notes.trim(),
    });

    if (!application) {
      setValues(emptyForm);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 px-4 py-6">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-5 shadow-xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-ink dark:text-slate-100">
              {application ? "Edit job application" : "Add job application"}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Keep the required fields tight so the board stays useful.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name" error={errors.company}>
              <input
                value={values.company}
                onChange={(event) => updateValue("company", event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-ink focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950"
              />
            </Field>
            <Field label="Role / position" error={errors.role}>
              <input
                value={values.role}
                onChange={(event) => updateValue("role", event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-ink focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <select
                value={values.status}
                onChange={(event) =>
                  updateValue("status", event.target.value as ApplicationFormValues["status"])
                }
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-ink focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950"
              >
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Deadline">
              <input
                type="date"
                value={values.deadline}
                onChange={(event) => updateValue("deadline", event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-ink focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950"
              />
            </Field>
          </div>

          <Field label="Job URL" error={errors.jobUrl}>
            <input
              type="url"
              value={values.jobUrl}
              onChange={(event) => updateValue("jobUrl", event.target.value)}
              placeholder="https://example.com/jobs/frontend-engineer"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-ink focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-950"
            />
          </Field>

          <Field label="Next action" error={errors.nextAction}>
            <input
              value={values.nextAction}
              onChange={(event) => updateValue("nextAction", event.target.value)}
              placeholder="Follow up, prepare for interview, submit take-home..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-ink focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-950"
            />
          </Field>

          <Field label="Notes">
            <textarea
              value={values.notes}
              onChange={(event) => updateValue("notes", event.target.value)}
              rows={4}
              className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm text-ink focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950"
            />
          </Field>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <span className="mt-1 block">{children}</span>
      {error ? (
        <span className="mt-1 block text-sm text-red-600 dark:text-red-300">{error}</span>
      ) : null}
    </label>
  );
}
