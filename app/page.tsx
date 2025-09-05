"use client";
import { useRef, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function Page() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  // Use your env var first, fall back to your Formspree endpoint for now
  const endpoint =
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
    "https://formspree.io/f/xgvlpnqb";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMsg("");

    try {
      const form = e.currentTarget;
      const data = new FormData(form);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
        mode: "cors",
      });

      if (res.ok) {
        await fetch("/api/notify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: formData.get("email"),
    name: formData.get("name"),
    company: formData.get("company"),
    role: formData.get("role"),
    notes: formData.get("notes"),
  }),
});

        setStatus("success");
        form.reset(); // safe: uses e.currentTarget
      } else {
        const j = await res.json().catch(() => ({}));
        setStatus("error");
        setMsg(j?.errors?.[0]?.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setStatus("error");
      setMsg(err?.message || "Network error. Please try again.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-xl w-full">
        <h1 className="text-2xl font-semibold mb-2">Join the waitlist</h1>
        <p className="text-slate-600 mb-6">
          Relief staffing for Australia’s LPO owners. Pop your details in and we’ll
          let you know when onboarding opens.
        </p>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-3" noValidate>
          <input className="input w-full" type="email" name="email" placeholder="Email" required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input" type="text" name="name" placeholder="Your name" required />
            <input className="input" type="text" name="company" placeholder="LPO / Company (optional)" />
          </div>

          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="LPO Owner" defaultChecked className="accent-[#f97316]" />
              LPO Owner
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="Relief Contractor" className="accent-[#f97316]" />
              Relief Contractor
            </label>
          </div>

          <textarea className="input w-full h-28" name="notes" placeholder="Notes (optional)" />

          <button className="button-primary" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Join Waitlist"}
          </button>

          {status === "success" && <p className="text-green-700">Thanks — you’re on the list!</p>}
          {status === "error" && <p className="text-red-600">{msg}</p>}
        </form>
      </div>
    </main>
  );
}
