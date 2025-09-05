"use client";
import { useRef, useState } from "react";

export default function Page() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle"|"submitting"|"success"|"error">("idle");
  const [msg, setMsg] = useState<string>("");

  const endpoint =
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
    "https://formspree.io/f/REPLACE_ME";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMsg("");

    const form = formRef.current;
    if (!form) {
      setStatus("error");
      setMsg("Form not ready. Please try again.");
      return;
    }

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
        form.reset(); // <-- form is guaranteed non-null here
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
    <form ref={formRef} onSubmit={onSubmit}>
      {/* inputs with name="email" | "name" | "company" | "role" | "notes" */}
      <button disabled={status==="submitting"}>Join Waitlist</button>
      {status==="error" && <p className="text-red-600">{msg}</p>}
      {status==="success" && <p className="text-green-600">Thanks—you're on the list!</p>}
    </form>
  );
}
