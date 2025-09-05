"use client";
import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState<"idle"|"submitting"|"success"|"error">("idle");
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMsg("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/REPLACE_ME";
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: data, mode: "cors" });
      if (res.ok) { setStatus("success"); form.reset(); }
      else { const j = await res.json().catch(() => ({})); setStatus("error"); setMsg(j?.error || "Something went wrong. Please try again."); }
    } catch (err:any) { setStatus("error"); setMsg(err?.message || "Network error. Try again."); }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="card">
          <h1 className="text-4xl font-bold">Relief staff for Australia’s LPO owners</h1>
          <p className="mt-3 text-lg text-slate-700">
            Verified Australia Post contractors. Clear rates (incl. Saturday premiums). Instant booking.
          </p>

          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="name">Full name</label>
              <input id="name" name="name" required className="input" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className="input" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="role">I am…</label>
              <select id="role" name="role" required className="input">
                <option value="">Select role</option>
                <option value="LPO owner">LPO owner</option>
                <option value="Contractor">Contractor</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="location">Postcode / State</label>
              <input id="location" name="location" className="input" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="timeline">When do you need this?</label>
              <select id="timeline" name="timeline" className="input">
                <option>ASAP</option>
                <option>This month</option>
                <option>Later</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="notes">Anything else?</label>
              <textarea id="notes" name="notes" rows={4} className="input" />
            </div>
            <button disabled={status==="submitting"} className="button-primary">
              {status === "submitting" ? "Submitting…" : "Join the waitlist"}
            </button>
            {status === "success" && <p className="text-green-700 text-sm">Thanks! You’re on the list. We’ll reach out with early access.</p>}
            {status === "error" && <p className="text-red-700 text-sm">{msg}</p>}
            <input type="hidden" name="_subject" value="GMAB Waitlist" />
          </form>

          <p className="mt-6 text-xs text-slate-500">
            By submitting, you agree to be contacted about early access. We never sell your info.
          </p>
        </div>
      </section>
      <footer className="py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Give Me A Break — LPO Locum
      </footer>
    </main>
  );
}
