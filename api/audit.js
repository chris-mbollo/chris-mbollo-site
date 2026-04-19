import { validateEmail } from "./_lib/validate-email.js";

const BEEHIIV_API = "https://api.beehiiv.com/v2";
const RESEND_API = "https://api.resend.com/emails";

const AUDIENCE_LABELS = {
  under_10k: "Under 10K",
  "10k_50k": "10K to 50K",
  "50k_200k": "50K to 200K",
  "200k_plus": "200K+",
};

const MONETIZATION_LABELS = {
  ad_revenue: "Ad revenue",
  brand_deals: "Brand deals",
  affiliate: "Affiliate income",
  course_or_product: "Course or digital product",
  coaching: "Coaching or consulting",
  none: "Does not monetize yet",
};

function cleanText(input, max) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/\s+/g, " ").slice(0, max);
}

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

  const platform = cleanText(req.body?.platform, 280);
  const audience = cleanText(req.body?.audience, 32);
  const gap = cleanText(req.body?.gap, 1500);

  const monetization = Array.isArray(req.body?.monetization)
    ? req.body.monetization
        .filter((m) => typeof m === "string" && MONETIZATION_LABELS[m])
        .slice(0, 6)
    : [];

  if (!platform || !AUDIENCE_LABELS[audience] || !gap) {
    return res.status(400).json({ error: "invalid_submission" });
  }

  const beehiivKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM || "Audit Leads <onboarding@resend.dev>";
  const leadsTo = process.env.LEADS_TO || "hello@chrismbollo.com";

  if (!beehiivKey || !publicationId) {
    console.error("beehiiv_env_missing");
    return res.status(500).json({ error: "server_error" });
  }

  try {
    await fetch(`${BEEHIIV_API}/publications/${publicationId}/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${beehiivKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: false,
        utm_source: "audit-lead",
        utm_medium: "website",
        utm_campaign: "creator-asset-audit",
        referring_site: "chrismbollo.com/audit",
      }),
    });
  } catch (err) {
    console.error("beehiiv_fetch_threw", err);
  }

  if (resendKey) {
    const audienceLabel = AUDIENCE_LABELS[audience];
    const monetizationLabel = monetization.length
      ? monetization.map((m) => MONETIZATION_LABELS[m]).join(", ")
      : "Does not monetize yet";

    const text = [
      "New Creator Asset Audit lead.",
      "",
      `Email: ${email}`,
      `Platform + handle: ${platform}`,
      `Audience size: ${audienceLabel}`,
      `Monetization: ${monetizationLabel}`,
      "",
      "Audience gap (what they keep asking for):",
      gap,
      "",
      "Sent from chrismbollo.com/audit",
    ].join("\n");

    try {
      const upstream = await fetch(RESEND_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: leadsTo,
          reply_to: email,
          subject: `New audit lead: ${email}`,
          text,
        }),
      });

      if (!upstream.ok) {
        const body = await upstream.text();
        console.error("resend_send_failed", upstream.status, body);
      }
    } catch (err) {
      console.error("resend_fetch_threw", err);
    }
  } else {
    console.warn("resend_env_missing_skipping_notification");
  }

  return res.status(200).json({ ok: true });
}
