# Chris Mbollo — Personal Brand Site Design Spec

**Date:** 2026-04-15
**Owner:** Chris Mbollo
**Status:** Approved for implementation planning

---

## 1. Purpose & Success Metric

The site has one job: convert traffic from YouTube, X, and Instagram into newsletter subscribers for *Build & Own*.

Everything else on the page (thesis, investor tests, work showcase, video) exists to build credibility that earns the email. Per the master strategy: YouTube → social clips → Website (credibility hub) → Newsletter (the real asset).

**Success metric:** first-visit email capture rate. No vanity analytics.

## 2. Architecture & Stack

- **Single-page site.** One scroll. Anchor links for in-page navigation. No multi-page routing.
- **Vanilla HTML/CSS/JS.** Zero build step. Edit `public/index.html` directly. Same model as DealHawk.
- **Hosting:** Vercel static + serverless functions in `api/`.
- **Newsletter capture:** one Vercel serverless function (`api/subscribe.js`) that writes to a Supabase table and triggers a welcome email via Resend. Owning the list in Supabase is the "Build & Own" thesis applied to the site itself, no vendor lock to a newsletter provider.
- **No CMS, no React, no Next.js.** Content changes are direct edits to `public/index.html`.

## 3. Page Sections (top to bottom)

### 3.1 Hero
- Name: Chris Mbollo
- Positioning line: *"I build software that earns when I don't."*
- Sub-line: one sentence framing Content vs. Capital.
- Primary CTA: email field + "Get Build & Own" button.
- Secondary affordance: small scroll indicator.

### 3.2 The Thesis
~200-word manifesto explaining the Content vs. Capital ladder (Tier 3 platform income, Tier 2 knowledge income, Tier 1 capital assets). Rendered as typographic prose, not a table. Peterson-style voice, no em dashes.

### 3.3 The Three Investor Tests
Three blocks, each led by an oversized serif numeral (01, 02, 03):
1. **The Recurring Test** — does money show up whether you posted or not?
2. **The Absence Test** — if you disappeared tomorrow, does the business survive?
3. **The Ownership Test** — if the platform deleted your account tonight, can you still reach your audience?

Each followed by a short essay paragraph explaining the test.

### 3.4 The Work
3-card grid, cards featured equally:

| Project | Status | One-liner |
|---|---|---|
| Vanguard Sales AI | In Progress | Real-time sales coach. Electron overlay that listens to calls and coaches you mid-conversation. |
| ADHD Companion | Shipped | Executive function app built on Expo + Supabase + Claude. |
| Brand Gap Agent | Shipped | Brand analysis tool. Input a brand, output its positioning gaps. |

Each card: project name, status tag, one-liner, optional link. Subtle preview image or icon slot per card.

### 3.5 Watch Me Build
One embedded YouTube video (latest long-form) + a text link to the channel. Not a grid. One video only, replaced on publish.

### 3.6 Newsletter Capture (primary conversion)
Full-width band. Large serif type. Copy:
- Headline: "Build & Own"
- Sub: "Weekly. Tuesdays. Under 500 words."
- Input + submit button.
- Inline success and error states (no modals, no redirects).

### 3.7 Footer
- Socials: X, YouTube, Instagram, GitHub.
- Email: hello@chrismbollo.com
- Minimal. No nav.

## 4. Visual Direction

Authoritative visual source: [DESIGN.md](../../../DESIGN.md) at project root. Implementation must match it exactly. Summary:

- **Vibe:** Editorial Luxury — Paper `#F7F5F0` canvas, Oxblood `#6B1F2A` single accent, film grain at 4% fixed overlay.
- **Type:** `Fraunces` display (variable serif), `Geist` body, `Geist Mono` metadata. Inter and generic serifs banned.
- **Layout:** Editorial Split for Hero + Newsletter band. Zig-zag for The Work. Left-hanging numerals for Investor Tests. 12-col grid with asymmetric containment.
- **Components:** Double-Bezel (outer shell + inner core) on project cards. Button-in-Button CTA with nested Phosphor Light arrow circle. Eyebrow tags on every section.
- **Motion:** Single custom cubic-bezier `(0.32, 0.72, 0, 1)`. Scroll-entry reveals with blur + translate + opacity via IntersectionObserver. Magnetic hover physics on buttons.
- **Copy rules:** No em dashes anywhere. No AI clichés ("Elevate", "Seamless", "Unleash", "Next-Gen"). Use commas, colons, semicolons, or full stops.

## 5. Data & API Contracts

### 5.1 `POST /api/subscribe`
- Request body: `{ email: string }`
- Validation: RFC-5322 shape, server-side.
- Side effects:
  1. Upsert row into Supabase `subscribers` table (columns: `email`, `source`, `created_at`).
  2. Fire welcome email via Resend.
- Response:
  - `200 { ok: true }` on success
  - `400 { error: "invalid_email" }` on validation failure
  - `500 { error: "server_error" }` on downstream failure

### 5.2 Supabase table `subscribers`
- `id uuid primary key default gen_random_uuid()`
- `email text unique not null`
- `source text default 'site_hero'`
- `created_at timestamptz default now()`

## 6. Security (pre-launch audit per CLAUDE.md)

- Server-side email validation, no client-only trust.
- No `innerHTML` with unescaped data anywhere.
- No unbounded AI proxy on this project (no AI endpoints at all in v1).
- CORS: same-origin only on `/api/subscribe`.
- Environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`. Never exposed to client.

## 7. Out of Scope (v1)

- Blog or article pages.
- Analytics dashboards.
- RSS, sitemap beyond basic.
- Dark mode.
- Multiple languages.
- Admin UI for managing subscribers (query Supabase directly).
- Showcasing projects beyond the three listed.

## 8. Acceptance Criteria

1. Page loads on mobile and desktop with no console errors.
2. Lighthouse Performance score ≥ 90 on desktop.
3. Email submit writes to Supabase and triggers a Resend email end-to-end.
4. No em dashes in any copy.
5. All three projects render as specified.
6. Footer links open in new tab where external.
7. CLAUDE.md file exists at project root with stack, architecture, and rules.

## 9. File Structure

```
chris-mbollo-site/
  CLAUDE.md
  package.json
  vercel.json
  public/
    index.html
    styles.css
    app.js
    assets/
  api/
    subscribe.js
  docs/
    superpowers/
      specs/
        2026-04-15-personal-brand-site-design.md
```
