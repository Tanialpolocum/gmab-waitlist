// app/page.tsx
"use client";
import { useRef, useState } from "react";

export default function Page() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [msg, setMsg] = useState<string>("");

  const endpoint =
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
    "https://formspree.io/f/REPLACE_ME"; // <-- put your Formspree ID here

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
        mode: "cors",
      });

      if (res.ok) {
        setStatus("success");
        formRef.current?.reset(); // <-- safely reset the form
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
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold mb-2">Join the waitlist</h1>
        <p className="text-slate-600 mb-6">
          Relief staffing for Australia’s LPO owners. Pop your details in and we’ll let you
          know when onboarding opens.
        </p>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-3" noValidate>
          <input className="input w-full" type="email" name="email" placeholder="Email" required />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input" type="text" name="name" placeholder="Your name" required />
            <input className="input" type="text" name="company" placeholder="LPO / Company (optional)" />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="role" value="owner" defaultChecked /> LPO Owner
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="role" value="contractor" /> Relief Contractor
            </label>
          </div>

          <textarea className="input w-full" name="notes" rows={4} placeholder="Notes (optional)" />

          <button
            type="submit"
            className="button-primary w-full"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending..." : "Join Waitlist"}
          </button>

          {status === "success" && <p className="text-green-600 mt-2">Thanks — you’re on the list!</p>}
          {status === "error" && <p className="text-red-600 mt-2">{msg}</p>}
        </form>
      </div>
    </main>
  );
}
