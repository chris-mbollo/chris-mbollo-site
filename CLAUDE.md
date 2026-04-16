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
