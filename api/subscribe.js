import { validateEmail } from "./_lib/validate-email.js";

const BEEHIIV_API = "https://api.beehiiv.com/v2";

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

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    console.error("beehiiv_env_missing");
    return res.status(500).json({ error: "server_error" });
  }

  const source = typeof req.body?.source === "string" ? req.body.source.slice(0, 64) : "site";

  try {
    const upstream = await fetch(
      `${BEEHIIV_API}/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: source,
          utm_medium: "website",
        }),
      }
    );

    if (!upstream.ok) {
      const body = await upstream.text();
      console.error("beehiiv_subscribe_failed", upstream.status, body);
      return res.status(502).json({ error: "server_error" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("beehiiv_fetch_threw", err);
    return res.status(500).json({ error: "server_error" });
  }
}
