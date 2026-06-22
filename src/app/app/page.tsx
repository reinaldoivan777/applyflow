import { redirect } from "next/navigation";
import { ApplyFlowApp } from "@/components/ApplyFlowApp";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-[118rem] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-ink dark:text-slate-100">ApplyFlow</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Signed in as {user.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[118rem] px-4 py-5 sm:px-6 lg:px-8">
        <ApplyFlowApp userId={user.id} />
      </section>
    </main>
  );
}
