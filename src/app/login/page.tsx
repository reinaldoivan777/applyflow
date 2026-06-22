"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callbackError, setCallbackError] = useState(false);

  useEffect(() => {
    setCallbackError(
      new URLSearchParams(window.location.search).get("error") === "auth_callback_failed",
    );
  }, []);

  async function handleSignInWithGoogle() {
    if (!isSupabaseConfigured()) {
      setError("Missing Supabase environment variables.");
      return;
    }

    setIsSigningIn(true);
    setError(null);

    const { error: signInError } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/app`,
      },
    });

    if (signInError) {
      setIsSigningIn(false);
      setError(signInError.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-bold text-ink dark:text-slate-100">ApplyFlow</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track your job search from applied to offer.
          </p>
        </div>

        {callbackError ? (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            Could not complete sign in. Please try again.
          </p>
        ) : null}
        {error ? (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSignInWithGoogle}
          disabled={isSigningIn}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          {isSigningIn ? "Opening Google..." : "Continue with Google"}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Sign in to manage your private job application board.
        </p>
      </section>
    </main>
  );
}
