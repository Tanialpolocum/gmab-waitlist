"use client";

import { useState } from "react";

export default function Page() {
  const [status, setStatus] =
    useState<"idle" | "submitting" | "success" | "error">("idle");
  const [msg, setMsg] = useState<string>("");

  const endpoint =
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/REPLACE_ME";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMsg("");
    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
        mode: "cors",
      });

      if (res.ok) {
        setStatus("success");
        e.currentTarget.reset();
      } else {
        const j = await res.json().catch(() => ({} as any));
        setStatus("error");
        setMsg(j?.error || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setStatus("error");
      setMsg(err?.message || "Network error. Please try again.");
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="card max-w-xl w-full bg-white">
        <h1 className="text-2xl font-semibold mb-2">Join the waitlist</h1>
        <p className="text-slate-600 mb-6">
          Relief staffing for Australia’s LPO owners. Pop your details in and we’ll let you know
          when onboarding opens.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Email address" required className="input w-full" />

          <div className="grid gap-2 sm:grid-cols-2">
            <input name="name" type="text" placeholder="Full name" className="input w-full" />
            <input name="company" type="text" placeholder="LPO / Company (optional)" className="input w-full" />
          </div>

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="lpo" defaultChecked />
              <span>LPO Owner</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="contractor" />
              <span>Relief Contractor</span>
            </label>
          </div>

          <textarea name="notes" placeholder="Anything else? (optional)" className="input w-full h-24" />

          {/* Honeypot for spam bots */}
          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

          <button disabled={status === "submitting"} className="button-primary">
            {status === "submitting" ? "Submitting…" : "Join Waitlist"}
          </button>

          {status === "success" && (
            <p className="text-green-600 text-sm">Thanks! You’re on the list. We’ll be in touch soon.</p>
          )}
          {status === "error" && <p className="text-red-600 text-sm">{msg}</p>}
        </form>
      </div>
    </main>
  );
}
