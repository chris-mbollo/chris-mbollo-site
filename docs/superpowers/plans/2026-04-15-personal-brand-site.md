# Chris Mbollo Personal Brand Site — Implementation Plan

> **Status 2026-04-18:** Plan executed. Task 2 (Supabase schema) was discarded and the `api/subscribe.js` implementation was later pivoted from Supabase + Resend to the Beehiiv API, since Chris's newsletter list already lives in Beehiiv at www.chrismbollo.com. Any Supabase/Resend code below is a historical artifact; see the spec doc and `api/subscribe.js` for the current contract.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a single-page personal brand site at `/Users/macbookpro/chris-mbollo-site/` that captures newsletter subscribers and showcases Chris's thesis and work, matching the editorial-luxury design language in DESIGN.md.

**Architecture:** Vanilla HTML/CSS/JS served as static files on Vercel. One serverless function (`api/subscribe.js`) handles email capture, writing to Supabase and triggering a Resend welcome email. No build step, no framework. Author edits `public/index.html` directly.

**Tech Stack:** HTML, CSS (custom properties, CSS Grid), vanilla ES modules, Vercel serverless (Node 20), Supabase (Postgres), Resend (transactional email), Fraunces + Geist from Google Fonts / Vercel Font CDN. Testing via `node --test`.

**Source docs:**
- Spec: `docs/superpowers/specs/2026-04-15-personal-brand-site-design.md`
- Design system: `DESIGN.md` (project root)

---

## File Structure

**Create:**
- `/Users/macbookpro/chris-mbollo-site/package.json` — deps + scripts
- `/Users/macbookpro/chris-mbollo-site/vercel.json` — routing + Node runtime
- `/Users/macbookpro/chris-mbollo-site/.gitignore`
- `/Users/macbookpro/chris-mbollo-site/.env.example`
- `/Users/macbookpro/chris-mbollo-site/CLAUDE.md` — project rules for future sessions
- `/Users/macbookpro/chris-mbollo-site/supabase/schema.sql` — subscribers table
- `/Users/macbookpro/chris-mbollo-site/api/subscribe.js` — email capture endpoint
- `/Users/macbookpro/chris-mbollo-site/api/_lib/validate-email.js` — shared validator
- `/Users/macbookpro/chris-mbollo-site/api/_lib/validate-email.test.js` — validator tests
- `/Users/macbookpro/chris-mbollo-site/public/index.html` — the page
- `/Users/macbookpro/chris-mbollo-site/public/styles.css` — all styles
- `/Users/macbookpro/chris-mbollo-site/public/app.js` — reveals, hover physics, form submit
- `/Users/macbookpro/chris-mbollo-site/public/assets/grain.svg` — film grain overlay
- `/Users/macbookpro/chris-mbollo-site/public/assets/chris.jpg` — hero inline portrait (user-provided)
- `/Users/macbookpro/chris-mbollo-site/public/assets/vanguard.jpg`, `adhd.jpg`, `brandgap.jpg` — project previews

**Modify:** none (greenfield project).

---

## Task 1: Project Scaffolding

**Files:**
- Create: `/Users/macbookpro/chris-mbollo-site/package.json`
- Create: `/Users/macbookpro/chris-mbollo-site/vercel.json`
- Create: `/Users/macbookpro/chris-mbollo-site/.gitignore`
- Create: `/Users/macbookpro/chris-mbollo-site/.env.example`
- Create: `/Users/macbookpro/chris-mbollo-site/CLAUDE.md`

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "chris-mbollo-site",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "vercel dev",
    "test": "node --test api/_lib/*.test.js",
    "lighthouse": "lighthouse http://localhost:3000 --preset=desktop --only-categories=performance,accessibility --output=json --output-path=./lighthouse.json --chrome-flags=\"--headless\""
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "resend": "^4.0.0"
  }
}
```

- [ ] **Step 2: Write `vercel.json`**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": false,
  "functions": {
    "api/subscribe.js": { "runtime": "nodejs20.x", "maxDuration": 10 }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

- [ ] **Step 3: Write `.gitignore`**

```
node_modules/
.env
.env.local
.vercel
lighthouse.json
.DS_Store
```

- [ ] **Step 4: Write `.env.example`**

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM=hello@chrismbollo.com
```

- [ ] **Step 5: Write `CLAUDE.md`**

```markdown
# Chris Mbollo Site — Project Rules

## Stack
Vanilla HTML/CSS/JS + Vercel serverless. No build step. Edit public/index.html directly.

## Structure
- public/ — static assets served at root
- api/ — Vercel serverless functions (Node 20)
- api/_lib/ — shared modules (prefixed underscore so Vercel does not expose them as routes)
- supabase/schema.sql — database schema, applied manually in Supabase dashboard

## Authoritative Docs
- docs/superpowers/specs/2026-04-15-personal-brand-site-design.md — product spec
- DESIGN.md — visual design system (fonts, colors, components, motion)

## Rules
- No em dashes in any copy. Use commas, colons, semicolons, or full stops.
- No AI clichés (Elevate, Seamless, Unleash, Next-Gen).
- Inter is banned. Use Fraunces (serif) and Geist (sans) only.
- Pure black `#000000` is banned. Use Ink `#141414`.
- No Lucide or Material icons. Phosphor Light stroke-1 only.
- Single accent color: Oxblood `#6B1F2A`. No second accent.
- No em dashes, no neon glow, no gradient text, no parallax.

## Run
- `npm run dev` — local via `vercel dev`
- `npm test` — validator unit tests
- `npm run lighthouse` — perf and a11y audit
```

- [ ] **Step 6: Install deps and commit**

```bash
cd /Users/macbookpro/chris-mbollo-site
npm install
git add package.json package-lock.json vercel.json .gitignore .env.example CLAUDE.md
git commit -m "chore: scaffold project (package.json, vercel config, env template)"
```

Expected: `node_modules/` created, lockfile written, commit recorded.

---

## Task 2: Supabase Schema

**Files:**
- Create: `/Users/macbookpro/chris-mbollo-site/supabase/schema.sql`

- [ ] **Step 1: Write schema**

```sql
-- subscribers table for Build & Own newsletter
create extension if not exists "pgcrypto";

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text not null default 'site_hero',
  created_at timestamptz not null default now()
);

create index if not exists subscribers_created_at_idx
  on public.subscribers (created_at desc);

-- Row Level Security: block all client access, force service-role writes from serverless
alter table public.subscribers enable row level security;
-- No policies created, which means no anon or authenticated access. Service role bypasses RLS.
```

- [ ] **Step 2: Commit**

```bash
git add supabase/schema.sql
git commit -m "feat: add subscribers table schema with RLS lockdown"
```

Note for operator: this SQL is applied manually in the Supabase SQL editor before deploy. It is committed for reference.

---

## Task 3: Email Validator (TDD)

**Files:**
- Create: `/Users/macbookpro/chris-mbollo-site/api/_lib/validate-email.js`
- Create: `/Users/macbookpro/chris-mbollo-site/api/_lib/validate-email.test.js`

- [ ] **Step 1: Write failing tests**

Write `/Users/macbookpro/chris-mbollo-site/api/_lib/validate-email.test.js`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEmail } from "./validate-email.js";

test("accepts a normal email", () => {
  assert.equal(validateEmail("chris@chrismbollo.com"), "chris@chrismbollo.com");
});

test("lowercases and trims input", () => {
  assert.equal(validateEmail("  Chris@ChrisMbollo.COM  "), "chris@chrismbollo.com");
});

test("rejects missing @", () => {
  assert.throws(() => validateEmail("chrischrismbollo.com"), /invalid_email/);
});

test("rejects empty string", () => {
  assert.throws(() => validateEmail(""), /invalid_email/);
});

test("rejects non-string", () => {
  assert.throws(() => validateEmail(null), /invalid_email/);
  assert.throws(() => validateEmail(undefined), /invalid_email/);
  assert.throws(() => validateEmail(42), /invalid_email/);
});

test("rejects strings longer than 254 chars", () => {
  const local = "a".repeat(250);
  assert.throws(() => validateEmail(`${local}@x.co`), /invalid_email/);
});

test("rejects dangerous header injection characters", () => {
  assert.throws(() => validateEmail("chris\\r\\n@x.com"), /invalid_email/);
  assert.throws(() => validateEmail("chris\\n@x.com"), /invalid_email/);
});
```

- [ ] **Step 2: Run tests, confirm they fail**

```bash
cd /Users/macbookpro/chris-mbollo-site
npm test
```

Expected: all 7 tests fail with module-not-found for `./validate-email.js`.

- [ ] **Step 3: Implement validator**

Write `/Users/macbookpro/chris-mbollo-site/api/_lib/validate-email.js`:

```javascript
// Conservative RFC-5322-ish shape check. Good enough for a newsletter form.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(input) {
  if (typeof input !== "string") {
    throw new Error("invalid_email");
  }
  const trimmed = input.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > 254) {
    throw new Error("invalid_email");
  }
  if (/[\r\n]/.test(trimmed)) {
    throw new Error("invalid_email");
  }
  if (!EMAIL_RE.test(trimmed)) {
    throw new Error("invalid_email");
  }
  return trimmed;
}
```

- [ ] **Step 4: Run tests, confirm they pass**

```bash
npm test
```

Expected: all 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add api/_lib/validate-email.js api/_lib/validate-email.test.js
git commit -m "feat: add email validator with hardening against header injection"
```

---

## Task 4: Subscribe Serverless Endpoint

**Files:**
- Create: `/Users/macbookpro/chris-mbollo-site/api/subscribe.js`

- [ ] **Step 1: Implement endpoint**

Write `/Users/macbookpro/chris-mbollo-site/api/subscribe.js`:

```javascript
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
```

- [ ] **Step 2: Sanity-check it parses**

```bash
cd /Users/macbookpro/chris-mbollo-site
node --check api/subscribe.js
```

Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add api/subscribe.js
git commit -m "feat: add subscribe endpoint with Supabase upsert and Resend welcome"
```

---

## Task 5: HTML Skeleton with Final Copy

**Files:**
- Create: `/Users/macbookpro/chris-mbollo-site/public/index.html`

- [ ] **Step 1: Write the full HTML**

Write `/Users/macbookpro/chris-mbollo-site/public/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Chris Mbollo — Build & Own</title>
  <meta name="description" content="I build software that earns when I do not. Writing and work from Chris Mbollo on Content vs. Capital, the creator economy, and the assets worth owning." />
  <meta property="og:title" content="Chris Mbollo — Build & Own" />
  <meta property="og:description" content="I build software that earns when I do not." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chrismbollo.com" />
  <link rel="canonical" href="https://chrismbollo.com" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <div class="grain" aria-hidden="true"></div>

  <main>
    <!-- HERO: Editorial Split, inline portrait -->
    <section class="hero">
      <div class="hero-inner">
        <p class="eyebrow">Build &amp; Own</p>
        <h1 class="hero-headline">
          I build
          <span class="inline-portrait" aria-hidden="true">
            <img src="/assets/chris.jpg" alt="" />
          </span>
          software that earns when I do not.
        </h1>
        <p class="hero-sub">Income requires your presence. Capital does not. I write about the difference, and I build the kinds of assets the second kind describes.</p>
        <form class="capture" data-source="hero" novalidate>
          <label for="hero-email" class="capture-label">Get Build &amp; Own. Tuesdays. Under 500 words.</label>
          <div class="capture-row">
            <input id="hero-email" type="email" name="email" required autocomplete="email" placeholder="you@work.com" />
            <button type="submit" class="btn-primary">
              <span class="btn-label">Subscribe</span>
              <span class="btn-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </span>
            </button>
          </div>
          <p class="capture-feedback" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>

    <!-- THESIS -->
    <section class="thesis">
      <p class="eyebrow">The Thesis</p>
      <h2 class="section-title">Content vs. Capital</h2>
      <div class="prose">
        <p>Most of what the internet calls a creator business is not a business. It is a job that rents its customers from a platform, and it stops paying the moment the camera turns off. Call this Tier 3, the platform tier, where the money and the reach both belong to someone else.</p>
        <p>One rung up is the knowledge tier, Tier 2, where a creator sells a course, a cohort, or a community. The ceiling is higher and the margins are better. The economics still depend on the creator continuing to show up, so the income still slows the moment attention does.</p>
        <p>The top tier is capital. Software, directories, tools, the kinds of assets that run when nobody is watching. The margin is the point. AI collapsed the cost of building these assets by roughly ninety percent. What used to need a team of engineers now needs a writer with taste and a week of discipline. That is what this site documents.</p>
      </div>
    </section>

    <!-- THREE INVESTOR TESTS -->
    <section class="tests">
      <p class="eyebrow">Three Investor Tests</p>
      <h2 class="section-title">What separates income from capital</h2>

      <article class="test">
        <div class="test-numeral">01</div>
        <div class="test-body">
          <h3 class="test-title">The Recurring Test</h3>
          <p>Does money show up whether you posted this week or not. If the answer is no, you do not have a business. You have a shift, and the clock starts over every Monday.</p>
        </div>
      </article>

      <article class="test">
        <div class="test-numeral">02</div>
        <div class="test-body">
          <h3 class="test-title">The Absence Test</h3>
          <p>If you disappeared for a month, does the operation survive. Real businesses have systems, customers with problems, and software that keeps running. A brand that collapses in your absence is a performance, not a company.</p>
        </div>
      </article>

      <article class="test">
        <div class="test-numeral">03</div>
        <div class="test-body">
          <h3 class="test-title">The Ownership Test</h3>
          <p>If the platform deleted your account tonight, can you still reach your audience tomorrow. The answer is either a list you own, a product people log in to, or silence. Most creators find out the answer on the worst day of their year.</p>
        </div>
      </article>
    </section>

    <!-- THE WORK: zig-zag, Double-Bezel -->
    <section class="work">
      <p class="eyebrow">The Work</p>
      <h2 class="section-title">What I am building right now</h2>

      <article class="project project-left">
        <div class="project-shell">
          <div class="project-core">
            <div class="project-image"><img src="/assets/vanguard.jpg" alt="Vanguard Sales AI preview" /></div>
            <div class="project-copy">
              <p class="status status-progress">In Progress</p>
              <h3 class="project-name">Vanguard Sales AI</h3>
              <p class="project-line">Real-time sales coach. An Electron overlay that listens to calls and coaches you mid-conversation, so the reps who deserve to win actually do.</p>
            </div>
          </div>
        </div>
      </article>

      <article class="project project-right">
        <div class="project-shell">
          <div class="project-core">
            <div class="project-copy">
              <p class="status status-shipped">Shipped</p>
              <h3 class="project-name">ADHD Companion</h3>
              <p class="project-line">Executive function, rebuilt. An Expo and Supabase app that handles the part of planning my brain refuses to do, so the work can start without the negotiation.</p>
            </div>
            <div class="project-image"><img src="/assets/adhd.jpg" alt="ADHD Companion preview" /></div>
          </div>
        </div>
      </article>

      <article class="project project-left">
        <div class="project-shell">
          <div class="project-core">
            <div class="project-image"><img src="/assets/brandgap.jpg" alt="Brand Gap Agent preview" /></div>
            <div class="project-copy">
              <p class="status status-shipped">Shipped</p>
              <h3 class="project-name">Brand Gap Agent</h3>
              <p class="project-line">Input a brand. Get back the positioning gap nobody on their team is paid to name. A second opinion from a system that has no political reason to lie.</p>
            </div>
          </div>
        </div>
      </article>
    </section>

    <!-- WATCH ME BUILD -->
    <section class="watch">
      <p class="eyebrow">Watch Me Build</p>
      <h2 class="section-title">The process, on tape</h2>
      <div class="video-frame">
        <div class="video-embed">
          <iframe
            src="about:blank"
            data-video-id="REPLACE_WITH_YOUTUBE_VIDEO_ID"
            title="Latest build from Chris Mbollo"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
      </div>
      <p class="watch-link"><a href="https://youtube.com/@chrismbollo" rel="noopener">See the whole channel.</a></p>
    </section>

    <!-- NEWSLETTER BAND: Editorial Split, dark -->
    <section class="band">
      <div class="band-inner">
        <div class="band-copy">
          <p class="eyebrow eyebrow-paper">Newsletter</p>
          <h2 class="band-title">Build &amp; Own. Tuesdays. Under 500 words.</h2>
          <p class="band-sub">One idea, stated clean upfront. One story with real numbers. A handful of reasons it is true. No hustle porn, no filler, no unsubscribe guilt trip.</p>
        </div>
        <form class="capture capture-band" data-source="band" novalidate>
          <label for="band-email" class="capture-label capture-label-paper">Your best email</label>
          <div class="capture-row">
            <input id="band-email" type="email" name="email" required autocomplete="email" placeholder="you@work.com" />
            <button type="submit" class="btn-primary btn-paper">
              <span class="btn-label">Subscribe</span>
              <span class="btn-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </span>
            </button>
          </div>
          <p class="capture-feedback" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-inner">
        <p class="footer-brand">Chris Mbollo</p>
        <ul class="footer-links">
          <li><a href="https://x.com/chrismbollo" rel="noopener">X</a></li>
          <li><a href="https://youtube.com/@chrismbollo" rel="noopener">YouTube</a></li>
          <li><a href="https://instagram.com/chrismbollo" rel="noopener">Instagram</a></li>
          <li><a href="https://github.com/chris-mbollo" rel="noopener">GitHub</a></li>
          <li><a href="mailto:hello@chrismbollo.com">hello@chrismbollo.com</a></li>
        </ul>
      </div>
    </footer>
  </main>

  <script type="module" src="/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Replace video id placeholder with a real one**

Ask Chris for his latest YouTube video id. Edit line with `REPLACE_WITH_YOUTUBE_VIDEO_ID`. If no video yet, temporarily hide the Watch section by adding `hidden` attribute to `<section class="watch">`.

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "feat: add HTML skeleton with final copy (Peterson-style, no em dashes)"
```

---

## Task 6: CSS Foundation (tokens, reset, typography, grain, grid)

**Files:**
- Create: `/Users/macbookpro/chris-mbollo-site/public/styles.css`
- Create: `/Users/macbookpro/chris-mbollo-site/public/assets/grain.svg`

- [ ] **Step 1: Write `grain.svg`** (noise texture, tileable, ~2% luminance variance)

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" seed="7"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
  </filter>
  <rect width="200" height="200" filter="url(#n)"/>
</svg>
```

- [ ] **Step 2: Write the foundation section of `styles.css`**

Write `/Users/macbookpro/chris-mbollo-site/public/styles.css`:

```css
/* ===== Tokens ===== */
:root {
  --paper: #F7F5F0;
  --ink: #141414;
  --graphite: #5B5B58;
  --rule: rgba(20, 20, 20, 0.1);
  --oxblood: #6B1F2A;
  --paper-15: rgba(247, 245, 240, 0.15);

  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Geist", system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;

  --ease: cubic-bezier(0.32, 0.72, 0, 1);
  --reveal-dur: 800ms;
  --hover-dur: 320ms;

  --max: 1280px;
  --gutter: clamp(1rem, 4vw, 2rem);
  --section-y: clamp(5rem, 12vw, 9rem);
}

/* ===== Reset ===== */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1.0625rem;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}
img { max-width: 100%; display: block; }
a { color: var(--oxblood); text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 3px; }
button { font: inherit; cursor: pointer; border: 0; background: none; }
input, button { font-family: inherit; }
h1, h2, h3 { margin: 0; font-family: var(--font-display); font-weight: 500; letter-spacing: -0.01em; }
p { margin: 0; }
ul { margin: 0; padding: 0; list-style: none; }

/* ===== Grain overlay ===== */
.grain {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  background-image: url("/assets/grain.svg");
  background-size: 200px 200px;
  opacity: 0.04;
  mix-blend-mode: multiply;
}

/* ===== Eyebrow ===== */
.eyebrow {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--graphite);
  padding: 0.375rem 0.75rem;
  background: rgba(20, 20, 20, 0.04);
  border-radius: 999px;
  margin: 0 0 1.5rem;
}
.eyebrow-paper {
  color: var(--paper);
  background: rgba(247, 245, 240, 0.1);
}

/* ===== Container + section rhythm ===== */
main { display: block; }
section {
  padding: var(--section-y) var(--gutter);
  max-width: var(--max);
  margin: 0 auto;
  position: relative;
}
section + section { border-top: 1px solid var(--rule); }

/* ===== Section titles ===== */
.section-title {
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  line-height: 1.1;
  max-width: 20ch;
  margin-bottom: 3rem;
}

/* ===== Reveal (JS adds .is-visible) ===== */
.reveal {
  opacity: 0;
  transform: translateY(64px);
  filter: blur(8px);
  transition:
    opacity var(--reveal-dur) var(--ease),
    transform var(--reveal-dur) var(--ease),
    filter var(--reveal-dur) var(--ease);
  will-change: transform, opacity;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; filter: none; transition: none; }
  * { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 3: Commit**

```bash
git add public/styles.css public/assets/grain.svg
git commit -m "feat: CSS foundation (tokens, reset, grain, reveal, eyebrow)"
```

---

## Task 7: Hero Section Styles (Editorial Split, inline portrait, Button-in-Button)

**Files:**
- Modify: `/Users/macbookpro/chris-mbollo-site/public/styles.css` (append)

- [ ] **Step 1: Append hero + button styles**

Append to `/Users/macbookpro/chris-mbollo-site/public/styles.css`:

```css
/* ===== Hero ===== */
.hero {
  min-height: 100dvh;
  display: grid;
  align-content: center;
  padding-top: clamp(6rem, 14vw, 10rem);
  padding-bottom: clamp(6rem, 14vw, 10rem);
}
.hero-inner {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
}
.hero-inner > .eyebrow { grid-column: 1 / -1; }
.hero-headline {
  grid-column: 1 / span 10;
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -0.02em;
}
.hero-sub {
  grid-column: 3 / span 7;
  margin-top: 2rem;
  color: var(--graphite);
  font-size: clamp(1rem, 1.3vw, 1.125rem);
  max-width: 52ch;
}
.inline-portrait {
  display: inline-grid;
  place-items: center;
  width: 0.9em;
  height: 0.9em;
  border-radius: 999px;
  overflow: hidden;
  vertical-align: middle;
  transform: translateY(-0.04em);
  margin: 0 0.12em;
  background: var(--rule);
}
.inline-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.05);
}

/* ===== Capture form ===== */
.capture {
  grid-column: 3 / span 8;
  margin-top: 3rem;
  display: grid;
  gap: 0.75rem;
}
.capture-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--graphite);
}
.capture-label-paper { color: rgba(247, 245, 240, 0.6); }
.capture-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: end;
}
.capture input[type="email"] {
  border: 0;
  border-bottom: 1px solid var(--ink);
  background: transparent;
  padding: 0.75rem 0;
  font-size: 1.125rem;
  color: var(--ink);
  outline: 0;
  border-radius: 0;
  transition: border-color var(--hover-dur) var(--ease), border-width var(--hover-dur) var(--ease);
}
.capture input[type="email"]::placeholder { color: var(--graphite); opacity: 0.6; }
.capture input[type="email"]:focus {
  border-bottom: 2px solid var(--oxblood);
  padding-bottom: calc(0.75rem - 1px);
}
.capture-band input[type="email"] {
  color: var(--paper);
  border-bottom-color: var(--paper);
}
.capture-band input[type="email"]::placeholder { color: rgba(247, 245, 240, 0.5); }
.capture-feedback {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--oxblood);
  min-height: 1.25rem;
}
.capture-feedback.is-success { color: var(--ink); }
.capture-band .capture-feedback.is-success { color: var(--paper); }

/* ===== Button-in-Button ===== */
.btn-primary {
  display: inline-grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.75rem 0.75rem 1.5rem;
  background: var(--oxblood);
  color: var(--paper);
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  transition: transform var(--hover-dur) var(--ease), background-color var(--hover-dur) var(--ease);
  will-change: transform;
}
.btn-primary:active { transform: scale(0.98); }
.btn-label { line-height: 1; }
.btn-icon {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: var(--paper-15);
  color: var(--paper);
  transition: transform var(--hover-dur) var(--ease), background-color var(--hover-dur) var(--ease);
}
.btn-primary:hover .btn-icon {
  transform: translate(1px, -1px) scale(1.05);
  background: rgba(247, 245, 240, 0.22);
}
.btn-paper {
  background: var(--paper);
  color: var(--ink);
}
.btn-paper .btn-icon {
  background: rgba(20, 20, 20, 0.08);
  color: var(--ink);
}
.btn-paper:hover .btn-icon { background: rgba(20, 20, 20, 0.14); }
```

- [ ] **Step 2: Commit**

```bash
git add public/styles.css
git commit -m "feat: hero styles with inline portrait and button-in-button CTA"
```

---

## Task 8: Thesis, Investor Tests, Work (Double-Bezel, zig-zag)

**Files:**
- Modify: `/Users/macbookpro/chris-mbollo-site/public/styles.css` (append)

- [ ] **Step 1: Append section styles**

Append to `/Users/macbookpro/chris-mbollo-site/public/styles.css`:

```css
/* ===== Thesis ===== */
.thesis .prose {
  max-width: 65ch;
  margin-left: clamp(0rem, 8vw, 8rem);
}
.thesis .prose p + p { margin-top: 1.25em; }
.thesis .prose p { color: var(--ink); }

/* ===== Investor Tests ===== */
.tests .test {
  display: grid;
  grid-template-columns: minmax(8rem, 0.3fr) minmax(0, 0.7fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  padding: clamp(2rem, 5vw, 4rem) 0;
  border-top: 1px solid var(--rule);
}
.tests .test:last-child { border-bottom: 1px solid var(--rule); }
.test-numeral {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(4rem, 10vw, 8rem);
  line-height: 1;
  color: var(--oxblood);
  letter-spacing: -0.03em;
}
.test-title {
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  margin-bottom: 0.75rem;
}
.test-body p { color: var(--ink); max-width: 60ch; }

/* ===== The Work: Double-Bezel zig-zag ===== */
.work .project { margin-top: clamp(2rem, 5vw, 4rem); }
.work .project:first-of-type { margin-top: 0; }

.project-shell {
  background: rgba(20, 20, 20, 0.04);
  border: 1px solid rgba(20, 20, 20, 0.06);
  padding: 0.375rem;
  border-radius: 2rem;
  transition: transform var(--hover-dur) var(--ease);
}
.project-shell:hover { transform: translateY(-2px); }
.project-core {
  background: var(--paper);
  border-radius: calc(2rem - 0.375rem);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.35);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: grid;
  grid-template-columns: minmax(0, 220px) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;
}
.project-right .project-core {
  grid-template-columns: minmax(0, 1fr) minmax(0, 220px);
}
.project-image {
  border-radius: 0.75rem;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  background: rgba(20, 20, 20, 0.04);
}
.project-image img { width: 100%; height: 100%; object-fit: cover; }
.project-name {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  margin: 0.75rem 0 0.75rem;
}
.project-line { color: var(--graphite); max-width: 55ch; }

.status {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(20, 20, 20, 0.05);
}
.status-shipped { color: var(--oxblood); }
.status-progress { color: var(--graphite); }
```

- [ ] **Step 2: Commit**

```bash
git add public/styles.css
git commit -m "feat: thesis, investor tests, and work section (Double-Bezel zig-zag)"
```

---

## Task 9: Watch, Newsletter Band, Footer

**Files:**
- Modify: `/Users/macbookpro/chris-mbollo-site/public/styles.css` (append)

- [ ] **Step 1: Append**

Append to `/Users/macbookpro/chris-mbollo-site/public/styles.css`:

```css
/* ===== Watch ===== */
.video-frame {
  background: rgba(20, 20, 20, 0.04);
  border: 1px solid rgba(20, 20, 20, 0.06);
  padding: 0.5rem;
  border-radius: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}
.video-embed {
  border-radius: calc(1.5rem - 0.5rem);
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: var(--ink);
}
.video-embed iframe { width: 100%; height: 100%; border: 0; display: block; }
.watch-link {
  text-align: center;
  margin-top: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--graphite);
}
.watch-link a { color: var(--ink); border-bottom: 1px solid var(--ink); padding-bottom: 2px; }
.watch-link a:hover { color: var(--oxblood); border-bottom-color: var(--oxblood); text-decoration: none; }

/* ===== Newsletter band ===== */
.band {
  background: var(--ink);
  color: var(--paper);
  max-width: none;
  padding-left: 0;
  padding-right: 0;
  border-top: 0;
}
.band + section { border-top: 0; }
.band-inner {
  max-width: var(--max);
  margin: 0 auto;
  padding: 0 var(--gutter);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(2rem, 4vw, 4rem);
  align-items: end;
}
.band-copy { grid-column: 1 / span 7; }
.band-title {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  line-height: 1.05;
  font-weight: 500;
  color: var(--paper);
  margin-bottom: 1.5rem;
  letter-spacing: -0.01em;
}
.band-sub { color: rgba(247, 245, 240, 0.7); max-width: 50ch; }
.capture-band { grid-column: 8 / span 5; }

/* ===== Footer ===== */
.footer {
  padding: clamp(3rem, 6vw, 4rem) var(--gutter);
  max-width: var(--max);
  margin: 0 auto;
  border-top: 1px solid var(--rule);
}
.footer-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2rem;
  align-items: center;
}
.footer-brand { font-family: var(--font-display); font-size: 1.125rem; }
.footer-links {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.footer-links a { color: var(--graphite); }
.footer-links a:hover { color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--ink); }
```

- [ ] **Step 2: Commit**

```bash
git add public/styles.css
git commit -m "feat: watch, newsletter band, footer"
```

---

## Task 10: Responsive Pass (<768px)

**Files:**
- Modify: `/Users/macbookpro/chris-mbollo-site/public/styles.css` (append)

- [ ] **Step 1: Append mobile media query**

Append to `/Users/macbookpro/chris-mbollo-site/public/styles.css`:

```css
/* ===== Mobile collapse ===== */
@media (max-width: 767px) {
  :root { --section-y: clamp(3rem, 8vw, 6rem); }

  .hero-inner { grid-template-columns: 1fr; }
  .hero-headline, .hero-sub, .capture { grid-column: 1 / -1; }
  .inline-portrait { display: block; width: 3.5rem; height: 3.5rem; margin: 0 0 1.5rem; }

  .thesis .prose { margin-left: 0; }

  .tests .test {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  .test-numeral { font-size: 4.5rem; }

  .project-core,
  .project-right .project-core {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .project-image { max-width: 220px; }

  .band-inner { grid-template-columns: 1fr; }
  .band-copy, .capture-band { grid-column: 1 / -1; }

  .capture-row { grid-template-columns: 1fr; }
  .btn-primary { justify-content: space-between; }

  .footer-inner { grid-template-columns: 1fr; }
}

/* Safeguard: never horizontal-scroll on mobile */
@media (max-width: 1024px) {
  body { overflow-x: hidden; }
}
```

- [ ] **Step 2: Commit**

```bash
git add public/styles.css
git commit -m "feat: responsive pass, mobile collapse below 768px"
```

---

## Task 11: JavaScript (reveals, form submit, lazy video)

**Files:**
- Create: `/Users/macbookpro/chris-mbollo-site/public/app.js`

- [ ] **Step 1: Write `app.js`**

Write `/Users/macbookpro/chris-mbollo-site/public/app.js`:

```javascript
// ===== Reveal on scroll =====
const revealTargets = document.querySelectorAll("section, .project, .test");
revealTargets.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("is-visible"), i * 100);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

// ===== Lazy YouTube embed =====
const iframe = document.querySelector("iframe[data-video-id]");
if (iframe) {
  const videoId = iframe.dataset.videoId;
  if (videoId && videoId !== "REPLACE_WITH_YOUTUBE_VIDEO_ID") {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
          io2.unobserve(iframe);
        }
      });
    }, { rootMargin: "200px" });
    io2.observe(iframe);
  } else {
    iframe.closest("section").hidden = true;
  }
}

// ===== Subscribe forms =====
document.querySelectorAll("form.capture").forEach((form) => {
  const feedback = form.querySelector(".capture-feedback");
  const button = form.querySelector("button[type=submit]");
  const input = form.querySelector("input[type=email]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedback.classList.remove("is-success");
    feedback.textContent = "";

    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      feedback.textContent = "That email does not look right.";
      input.focus();
      return;
    }

    const originalLabel = button.querySelector(".btn-label").textContent;
    button.querySelector(".btn-label").textContent = "Sending";
    button.disabled = true;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: form.dataset.source || "site" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "server_error");

      feedback.classList.add("is-success");
      feedback.textContent = "Check your inbox. Tuesdays from here on.";
      input.value = "";
    } catch (err) {
      feedback.textContent = err.message === "invalid_email"
        ? "That email does not look right."
        : "Something broke on our end. Try again in a minute.";
    } finally {
      button.querySelector(".btn-label").textContent = originalLabel;
      button.disabled = false;
    }
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add public/app.js
git commit -m "feat: scroll reveals, lazy youtube embed, form submit handler"
```

---

## Task 12: Asset Placeholders

**Files:**
- Create: `/Users/macbookpro/chris-mbollo-site/public/assets/chris.jpg` (portrait, 1:1, ideally 512x512)
- Create: `/Users/macbookpro/chris-mbollo-site/public/assets/vanguard.jpg` (project preview 1:1)
- Create: `/Users/macbookpro/chris-mbollo-site/public/assets/adhd.jpg`
- Create: `/Users/macbookpro/chris-mbollo-site/public/assets/brandgap.jpg`

- [ ] **Step 1: Ask Chris for 4 images**

Request from Chris: a square portrait and three project screenshots or iconic thumbnails (1:1 ratio preferred, minimum 512x512, JPG). Drop into `public/assets/`.

- [ ] **Step 2: If images are not ready, use temporary neutral placeholders**

Create solid-color JPGs as placeholders so the site does not show broken images during review:

```bash
cd /Users/macbookpro/chris-mbollo-site/public/assets
# use ImageMagick if installed; otherwise download neutral placeholders
for name in chris vanguard adhd brandgap; do
  curl -sL "https://placehold.co/512x512/5B5B58/F7F5F0/jpg?text=${name}" -o "${name}.jpg"
done
ls -la
```

Expected: four JPGs at ~10-30KB each.

- [ ] **Step 3: Commit**

```bash
git add public/assets/chris.jpg public/assets/vanguard.jpg public/assets/adhd.jpg public/assets/brandgap.jpg
git commit -m "chore: add temporary image placeholders"
```

---

## Task 13: Local Verification

**Files:** none (smoke test)

- [ ] **Step 1: Run local dev server**

```bash
cd /Users/macbookpro/chris-mbollo-site
npm install -g vercel 2>/dev/null || true
vercel dev
```

Expected: dev server on `http://localhost:3000`. Open in browser.

- [ ] **Step 2: Visual walk-through checklist**

- [ ] Hero renders, inline portrait is circular and type-height
- [ ] Headline is Fraunces, body is Geist, meta caps are Geist Mono
- [ ] Oxblood accent appears only on: submit buttons, Investor Test numerals, body links
- [ ] Scroll reveals fire once per section with blur + translate fade
- [ ] Button hover: inner arrow circle nudges up-right and scales slightly
- [ ] The Work: cards alternate image side (left, right, left)
- [ ] Newsletter band is dark with Paper text, form is right-column
- [ ] Mobile (< 768px): single column, no horizontal scroll, inline portrait stacks above headline
- [ ] Console: zero errors
- [ ] No em dashes anywhere in the page text

- [ ] **Step 3: Submit a test email (if Supabase + Resend env vars configured)**

```bash
# in a second terminal
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test+site@chrismbollo.com"}'
```

Expected: `{"ok":true}`. Check Supabase `subscribers` table for the row, check inbox for welcome email.

- [ ] **Step 4: Run Lighthouse**

```bash
npm run lighthouse
cat lighthouse.json | node -e "let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d); const s=j.categories; console.log('Perf:', Math.round(s.performance.score*100), 'A11y:', Math.round(s.accessibility.score*100));})"
```

Expected: Performance ≥ 90, Accessibility ≥ 95. If below, investigate: font loading, image sizes, render-blocking CSS.

- [ ] **Step 5: Commit lighthouse results (optional) and any fixes**

```bash
git add -A
git commit -m "chore: local verification pass"
```

---

## Task 14: Deploy

**Files:** none (remote deploy)

Order matters per Chris's preference in memory: GitHub first, Vercel second. Only deploy when Chris explicitly asks.

- [ ] **Step 1: Push to GitHub**

Wait for Chris to confirm. Then:

```bash
cd /Users/macbookpro/chris-mbollo-site
gh repo create chris-mbollo-site --private --source=. --remote=origin --push
```

Expected: repo created, code pushed.

- [ ] **Step 2: Wait for Chris to ask before deploying to Vercel**

Do not auto-deploy. Per Chris's feedback memory: only deploy when explicitly asked.

When asked:

```bash
vercel --prod
```

Set env vars in Vercel dashboard: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM`.

- [ ] **Step 3: Post-deploy smoke test**

Visit the production URL. Submit an email. Confirm it lands in Supabase and triggers a Resend welcome.

---

## Self-Review Notes

**Spec coverage:**
- Purpose & metric → Task 5 (hero capture), Task 9 (band capture), Task 13 (verification)
- Architecture → Tasks 1, 4 (scaffolding + serverless endpoint)
- All seven page sections → Tasks 5 (HTML), 7-9 (CSS)
- Visual direction → DESIGN.md plus Tasks 6-10
- API contracts → Task 4
- Supabase schema → Task 2
- Security (validator, RLS, CORS, env discipline) → Tasks 1, 2, 3, 4
- Acceptance criteria → Task 13

**Placeholders addressed:** image assets in Task 12 (placeholder fallback present), YouTube id in Task 5 step 2 (hide if not ready).

**Ambiguity resolved:** video section is hidden if no real video id is provided, so the site launches cleanly before the first YouTube post.
