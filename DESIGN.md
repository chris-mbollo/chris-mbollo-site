# Design System: Chris Mbollo — Build & Own

## 1. Visual Theme & Atmosphere

A restrained editorial interface with the gravity of a university press and the confidence of a modern studio. The mood is "serious researcher, not marketer" — a site that feels written rather than designed. Generous whitespace, asymmetric placement, quiet motion. The visual equivalent of Peterson-style prose: precise, unhurried, honest.

- **Density:** Art Gallery Airy (2) — whitespace carries more weight than content
- **Variance:** Offset Asymmetric (7) — compositions deliberately lopsided, never centered
- **Motion:** Static Restrained (2) — fade-ins only, no parallax, no scroll theatrics

## 2. Color Palette & Roles

- **Paper** `#F7F5F0` — Primary canvas, warm off-white, the page itself
- **Ink** `#141414` — Near-black, primary text, headlines, numerals
- **Graphite** `#5B5B58` — Secondary text, metadata, captions
- **Rule** `#1C1C1C1A` — Hairline dividers between sections (ink at 10% alpha)
- **Oxblood** `#6B1F2A` — Single accent. Used for links, primary CTA fill, and the numerals on the Three Investor Tests. Saturation 55%, no glow, no gradient.

No second accent. No neon. No purple. No pure black.

## 3. Typography Rules

- **Display:** `Fraunces` (variable, weights 400/500/600, optical-size on) — editorial serif with warmth, for hero headline, section titles, and the large numerals on the Investor Tests. Track tight at display sizes, normal at subhead sizes.
- **Body:** `Geist` (weights 400/500) — modern sans with character, relaxed leading (1.7), max-width 65ch.
- **Mono:** `Geist Mono` — metadata, status tags ("Shipped", "In Progress"), footer email.
- **Banned:** `Inter`, `Times New Roman`, `Georgia`, `Garamond`, `Palatino`, any generic system serif.

**Scale (clamp-driven):**
- Hero headline: `clamp(2.5rem, 7vw, 5.5rem)` Fraunces 500
- Section titles: `clamp(1.75rem, 3vw, 2.75rem)` Fraunces 500
- Investor Test numerals: `clamp(4rem, 10vw, 8rem)` Fraunces 400 in Oxblood
- Body: `1.0625rem` (17px) Geist 400 in Ink
- Caption/meta: `0.8125rem` (13px) Geist Mono 400 in Graphite, tracked +0.04em, uppercase

## 4. Hero — Inline Image Typography

The hero uses Stitch's signature move: an inline photographic element sitting at type-height inside the headline.

- Headline draft: `I build` [inline portrait of Chris, circular, type-height, grayscale] `software that earns when I don't.`
- Portrait is `1em` tall, perfectly circular, sits on the baseline, tracked like a letter (no overlap, clean spatial zone).
- Layout is **asymmetric left-aligned**, headline occupies columns 1–9 of a 12-col grid. A thin sub-line and single email CTA sit in columns 1–6 below, offset right by two columns.
- No scroll indicator. No chevron. No "Watch below" text.
- On mobile (<768px) the inline portrait stacks above the headline as a small avatar, headline drops to a single column.

## 4b. Variance Engine Selection (High-End Visual Design)

- **Vibe Archetype:** Editorial Luxury — Paper `#F7F5F0` canvas, Oxblood accent, Fraunces variable serif, film-grain overlay at 4% opacity on a fixed pointer-events-none layer.
- **Layout Archetype:** Editorial Split for Hero (massive type left, asymmetric form right) and Newsletter band. Zig-zag rhythm for The Work. Investor Tests use left-hanging numerals into the margin.
- **Motion Easing:** Single custom cubic-bezier used throughout: `cubic-bezier(0.32, 0.72, 0, 1)`. Duration base 700ms for entries, 220ms for hovers.
- **Icons:** Phosphor Light only, stroke-width 1. No Lucide thick-stroke, no Material, no FontAwesome.

## 5. Component Stylings

- **Buttons (primary) — Button-in-Button architecture:** Fully rounded pill (`rounded-full`), Oxblood fill, Paper text, `px-6 py-3`, Geist 500. Trailing arrow (Phosphor Light arrow-up-right) is nested inside its own `w-8 h-8 rounded-full bg-paper/15` circle flush with the right inner padding — never a naked arrow next to the label. Hover (magnetic physics): whole button scales `0.98` on active-press simulation, inner arrow circle translates `+1px right, -1px up` and scales `1.05`. Custom easing `cubic-bezier(0.32, 0.72, 0, 1)` at 320ms.
- **Email input:** Label above (Geist Mono caption), input is a 1px Ink bottom rule only, no boxed field, no border-radius. Focus state thickens rule to 2px and shifts to Oxblood. Error text below in Oxblood, never red.
- **Project cards (The Work) — Double-Bezel (Doppelrand):** Each project is a composed block using nested enclosures, not a flat div.
  - **Outer Shell:** `bg-ink/[0.04]`, `ring-1 ring-ink/[0.06]`, `p-1.5`, `rounded-[2rem]`.
  - **Inner Core:** `bg-paper`, `rounded-[calc(2rem-0.375rem)]`, inner highlight `shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]`, `p-8`.
  - Inside the core: small square preview image (96px, `rounded-[0.75rem]`), project name in Fraunces 500, status tag in Geist Mono caption pill (`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]`), Oxblood for Shipped and Graphite for In Progress, one-liner in Geist body.
  - Zig-zag rhythm: image left on project 1, right on project 2, left on project 3.
- **Investor Test blocks:** Oversized Oxblood numeral left-hanging into the margin, body text in a single column beside it. No box, no background fill.
- **Video embed:** Native YouTube iframe, Paper-framed with 2rem padding, hairline rule below. No overlay, no custom play button.
- **Loaders:** Skeletal shimmer matching block dimensions. Never a circular spinner.
- **Empty/success states on email submit:** Inline success swaps the input for a single line of Geist body: `Check your inbox. Tuesdays from here on.` No modal, no toast, no checkmark icon.

## 6. Layout Principles

- **Grid:** 12-column CSS Grid with `clamp(1rem, 4vw, 2rem)` gutters. Max-width container 1280px, left-padded more than right (asymmetric containment).
- **Section rhythm:** Vertical gap `clamp(5rem, 12vw, 9rem)` between major sections. Hairline rule separates, no section backgrounds.
- **The Work section:** Not a 3-column grid. Projects stack vertically as full-width blocks with the preview image alternating column side (left, right, left) — a **zig-zag rhythm**. Banned: equal 3-card horizontal grid.
- **Newsletter band:** Full-bleed Ink background with Paper text, asymmetric — headline left columns 1–7, form right columns 8–12, stacked on mobile.
- **No overlapping elements.** No absolute-positioned text over images. Every zone is clean.
- **No centered hero.** Variance is 7; centered hero is banned.
- **`min-h-[100dvh]`** for any viewport-height section. Never `h-screen`.

## 7. Motion & Interaction

- **Reveals:** IntersectionObserver-driven. Each section enters with `translate-y-16 blur-md opacity-0` resolving to `translate-y-0 blur-0 opacity-100` over 800ms using `cubic-bezier(0.32, 0.72, 0, 1)`. Stagger 100ms between sibling blocks. Never use `window.addEventListener('scroll')`.
- **Hover states:** Oxblood underline grows from left on inline links over 220ms. Buttons nudge 4px, no glow.
- **Perpetual micro-loop:** Only one — a slow 4s opacity shimmer on the "Next issue: Tuesday" caption in the newsletter band. Nothing else animates indefinitely.
- **Scroll:** No parallax. No sticky. No scroll-linked anything beyond the one fade-in reveal.
- **Performance:** `transform` and `opacity` only. Grain is a fixed pseudo-element overlay at 4% opacity on the Paper canvas, never animated.

## 8. Responsive Rules

- Mobile-first collapse at 768px. All multi-column layouts become single column.
- Hero portrait detaches from inline position and stacks above headline at mobile.
- Zig-zag work blocks become vertical stacks with image above copy.
- Newsletter band becomes stacked (headline, form below).
- All interactive targets ≥ 44px.
- Body minimum 1rem / 16px.
- No horizontal overflow ever.

## 8b. Eyebrow Tags & Section Architecture

Every major section (The Thesis, The Three Investor Tests, The Work, Watch Me Build, Build & Own) is preceded by an eyebrow tag: a microscopic pill `rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium` in Geist Mono, Graphite text, `bg-ink/[0.04]` fill. Reads as a chapter marker, never a decoration.

Section vertical padding minimum `py-24`, scaling to `py-40` at desktop. The page breathes heavily.

## 8c. Performance Guardrails

- `transform` and `opacity` animations only. Never `top`, `left`, `width`, `height`.
- `backdrop-blur` is not used on any scrolling content. The only blur in the design is on the `Fluid Island` nav (if added) and the scroll-entry reveals.
- Film grain overlay is a fixed pseudo-element (`position: fixed; inset: 0; pointer-events: none`), never attached to scrolling content.
- `will-change: transform` only applied to elements actively animating.
- No arbitrary z-indexes. Reserved layers only: nav, modal, overlay.

## 9. Anti-Patterns (Banned)

- No emojis anywhere
- No `Inter`
- No generic serifs (`Times`, `Georgia`, `Garamond`, `Palatino`)
- No pure black `#000000`
- No em dashes in any copy (Chris rule, reinforced)
- No neon, no glow, no drop-shadow accents
- No gradients on text
- No centered hero
- No 3-equal-card horizontal grid in The Work
- No "Scroll to explore", no bouncing chevron, no scroll indicator
- No custom mouse cursors
- No AI clichés: "Elevate", "Seamless", "Unleash", "Next-Gen", "Supercharge"
- No fake round numbers (99.99%, 50% placeholders)
- No stock Unsplash filler — use real project screenshots or omit
- No overlapping elements
- No parallax
- No hero video background
- No testimonial carousel (none in v1)
- No Lucide, Material, or FontAwesome icons (Phosphor Light stroke-1 only)
- No generic 1px solid gray borders (hairlines are Ink at 10% alpha)
- No `linear` or `ease-in-out` transitions (single custom cubic-bezier only)
- No `h-screen` (use `min-h-[100dvh]`)
- No `window.addEventListener('scroll')` (IntersectionObserver only)
