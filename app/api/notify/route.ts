import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name, company, role, notes } = await req.json();

    const html = `
      <h2>New GMAB Waitlist Signup</h2>
      <ul>
        <li><b>Name:</b> ${name || "-"}</li>
        <li><b>Email:</b> ${email || "-"}</li>
        <li><b>Role:</b> ${role || "-"}</li>
        <li><b>Company:</b> ${company || "-"}</li>
        <li><b>Notes:</b> ${notes || "-"}</li>
      </ul>
    `;

    await resend.emails.send({
      // Use onboarding@resend.dev for testing. Switch to your domain email once verified in Resend.
      from: "Give Me A Break <onboarding@resend.dev>",
      to: (process.env.NOTIFY_TO ?? "taniamwalker@gmail.com").split(","),
      subject: "New Waitlist Signup",
      html
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "notify_failed" }, { status: 500 });
  }
}
