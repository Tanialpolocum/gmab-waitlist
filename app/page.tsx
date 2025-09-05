"use client";

import React, { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function Page() {  
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  // Use the env var if present, else fall back to a placeholder
  const endpoint =
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
    "https://formspree.io/f/REPLACE_ME";

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

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || "Something went wrong");
    }

    form.reset();                    // << no ref needed
    setStatus("success");
    setMsg("Thanks! You're on the list.");
  } catch (err: any) {
    setStatus("error");
    setMsg(err?.message || "Network error. Try again.");
  }
}

    } catch (err: any) {
      setStatus("error");
      setMsg(err?.message || "Network error. Please try again.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          Join the waitlist
        </h1>
        <p className="text-slate-600 mb-6">
          Relief staffing for Australia’s LPO owners. Pop your details in and
          we’ll let you know when onboarding opens.
        </p>

        {/* Status banner */}
        {status === "success" && (
          <div className="mb-4 rounded-lg bg-green-50 text-green-800 px-3 py-2">
            Thanks — you’re on the list! 🎉
          </div>
        )}
        {status === "error" && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-3 py-2">
            {msg || "Something went wrong. Please try again."}
          </div>
        )}

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className="input w-full"
          />

          <div class
