import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { validateEmail } from "./_lib/validate-email.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || "hello@chrismbollo.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  let email;
  try {
    email = validateEmail(req.body?.email);
  } catch {
    return res.status(400).json({ error: "invalid_email" });
  }

  const { error: dbError } = await supabase
    .from("subscribers")
    .upsert({ email, source: "site_hero" }, { onConflict: "email", ignoreDuplicates: true });

  if (dbError) {
    console.error("supabase_upsert_failed", dbError);
    return res.status(500).json({ error: "server_error" });
  }

  try {
    await resend.emails.send({
      from: `Chris Mbollo <${FROM}>`,
      to: email,
      subject: "You are on the list for Build & Own",
      text: [
        "Thanks for subscribing to Build & Own.",
        "",
        "Every Tuesday. Under 500 words. One idea, one story, the reasons it is true.",
        "",
        "If this ends up in promotions or spam, drag it to your primary inbox so it keeps showing up.",
        "",
        "Chris",
      ].join("\n"),
    });
  } catch (emailError) {
    console.error("resend_send_failed", emailError);
    // Subscriber is already saved. Do not block the response on email failure.
  }

  return res.status(200).json({ ok: true });
}
