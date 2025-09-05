export const runtime = "nodejs"; // be explicit: use Node runtime

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email, name, company, role, notes } = await req.json();

    await resend.emails.send({
      from: "Give Me A Break <onboarding@resend.dev>", // change later to your domain if you verify it
      to: ["YOUR_EMAIL@EXAMPLE.COM"],                  // <-- put your inbox here
      reply_to: email,
      subject: "New waitlist signup",
      text: [
        `Email:   ${email || "-"}`,
        `Name:    ${name || "-"}`,
        `Role:    ${role || "-"}`,
        `Company: ${company || "-"}`,
        `Notes:   ${notes || "-"}`,
      ].join("\n"),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return new Response("Email failed", { status: 500 });
  }
}
