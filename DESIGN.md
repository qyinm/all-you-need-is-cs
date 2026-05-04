# All You Need is CS — Design System

## Overview

**All You Need is CS** is a learning surface for data structures and algorithms: each concept gets a dedicated route with an interactive **p5.js** visualization. The chrome (everything outside the sketch) should feel like a **quiet technical document** on a single sheet of paper—not a neon “edu-tech” landing page.

The home page is intentionally minimal: a **center-aligned hero** (`{typography.display-xl}`), a **soft command pill** (`{component.install-snippet}`) for the local dev entry point, one **black primary CTA** to the topic index, and a **grid of topic cards** (`{component.topic-card}`) with hairline borders. Topic pages reuse the same tokens: **56px nav**, **720px reading column** for titles, and a **`{component.viz-panel}`** wrapper around the canvas and controls.

The philosophy matches a **flat, documentation-first** aesthetic (inspired by aggressively minimal product marketing sites): **no gradients** in the UI shell, **no drop shadows** on chrome, **pill geometry** (`{rounded.full}`) for controls, and **12px radius** (`{rounded.lg}`) for panels and the canvas frame. **Pure black** (`{colors.primary}`) is the only CTA color.

**Key characteristics**

- **Paper-white canvas** (`{colors.canvas}`) end-to-end—no alternating section bands.
- **Center-aligned hero** with rounded **Nunito** (stand-in for SF Pro Rounded) display type; body copy in **Inter** / system sans.
- **Pills for all interactive chrome**: buttons, inputs, selects—`{rounded.full}`.
- **Hairline-bordered panels** `{rounded.lg}` for topic content and the visualization area.
- **Monochrome palette** for UI: black, grays, white—**no purple/green/blue brand accents** in chrome (p5 sketches may use color internally for pedagogy).
- **Optional single inverted surface** (`{colors.surface-dark}`) per page for one high-emphasis callout only—use sparingly (e.g. future “Phase 2” strip), never stacked.

## Colors

> **Scope:** Global layout (`/`, `/topics/[id]`), not the interior of p5 sketches (which use their own palettes for clarity).

### Brand & accent

- **Pure Black** (`{colors.primary}` — `#000000`): primary CTAs, strongest emphasis.
- **Ink Deep** (`{colors.ink-deep}` — `#090909`): pressed / hover compression for primary buttons.

### Surface

- **Canvas** (`{colors.canvas}` — `#ffffff`): default page background.
- **Soft Surface** (`{colors.surface-soft}` — `#fafafa`): command pill, topic difficulty chips, subtle fills.
- **Surface Dark** (`{colors.surface-dark}` — `#171717`): reserved for **one** inverted strip or card per view when needed.
- **Hairline** (`{colors.hairline}` — `#e5e5e5`): borders, dividers, canvas frame.
- **Hairline Strong** (`{colors.hairline-strong}` — `#d4d4d4`): stronger separation where needed.

### Text

- **Ink** (`{colors.ink}` — `#000000`): headings, primary labels.
- **Charcoal** (`{colors.charcoal}` — `#525252`): secondary list / chip text.
- **Body** (`{colors.body}` — `#737373`): paragraphs, descriptions, footer.
- **Mute** (`{colors.mute}` — `#a3a3a3`): meta, de-emphasized UI copy.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): text on `{colors.surface-dark}`.
- **On Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.7)`): secondary on dark surfaces.

### Semantic (chrome)

Public marketing chrome avoids red/green/yellow **states**. Interactive **visualization toolbars** may use **only** `{component.button-primary}` and `{component.button-secondary}`—no “destructive red” forDelete buttons in the design system; prefer outline secondary for all non-primary actions.

Optional **terminal chrome** (if we add a mocked terminal elsewhere): traffic-light dots are documented as decorative only, not status semantics.

### Focus

- **Focus Ring** (`{colors.focus-ring}` — `rgba(59,130,246,0.5)`): default focus visibility. The **only** intentional blue in the shell.

## Typography

### Font families

- **Display (rounded geometric):** **Nunito** at weights **500 / 600** — hero and section titles (substitute for SF Pro Rounded where Apple fonts are unavailable).
- **Body:** **Inter** + `ui-sans-serif` fallbacks — paragraphs, nav, buttons, card copy.
- **Mono:** **Geist Mono** + `ui-monospace` — command pill, control labels, Viz status captions, numeric inputs.

### Hierarchy

| Token | Size | Weight | Line height | Use |
| --- | --- | --- | --- | --- |
| `{typography.display-xl}` | 36px (28px mobile) | 500 | ~1.11 | Hero: “All You Need is Computer Science” |
| `{typography.display-lg}` | 30px | 500 | 1.2 | Index: “Choose a topic” |
| `{typography.heading-lg}` | 24px | 600 | 1.33 | In-page section labels |
| `{typography.heading-md}` | 20px | 500 | 1.4 | Topic card titles |
| `{typography.heading-sm}` | 18px | 500 | 1.56 | Viz subheads (e.g. “Stack (LIFO)”) |
| `{typography.body-md}` | 16px | 400 | 1.5 | Topic subtitles, body |
| `{typography.body-strong}` | 16px | 500 | 1.5 | Emphasis in body |
| `{typography.body-sm}` | 14px | 400 | 1.43 | Secondary copy |
| `{typography.body-sm-strong}` | 14px | 500 | 1.43 | Button labels |
| `{typography.caption-sm}` | 12px | 400 | 1.33 | Footer, meta under viz |
| `{typography.code-md}` | 16px | 400 | 1.5 | `install-snippet` line |
| `{typography.code-sm}` | 14px | 400 | 1.43 | Inline code, viz hints |
| `{typography.button-md}` | 14px | 500 | 1 | Toolbar buttons |

### Principles

Tight step from display → body keeps the app feeling like **one readable column**, not a tall marketing funnel. **No italic** for chrome; sketches may draw their own text styles.

### Font substitutes

On platforms without Nunito loaded, fall back through `system-ui`. For mono, **JetBrains Mono** / **Fira Code** are acceptable alternatives to Geist Mono.

## Layout

### Spacing

- **Base unit:** 8px.
- **Section rhythm:** **`{spacing.section}` ≈ 88px** vertical between major blocks on desktop; **64px** tablet, **48px** mobile.
- **Topic card padding:** `{spacing.xxl}` (32px) internal.
- **Viz panel padding:** `{spacing.lg}` (16px).

### Grid & containers

| Surface | Max width | Notes |
| --- | --- | --- |
| Hero copy | ~720px | Centered column |
| Topic index grid | ~960px | Responsive 1–3 columns |
| Topic title + description | ~720px | Centered |
| Viz + toolbar | ~720px inside panel | Canvas scales with container width |

### Whitespace

Separate sections with **empty vertical space**, not colored bands. Avoid decorative dividers except **1px hairline** where the spec calls for it.

## Elevation & depth

| Level | Treatment | Use |
| --- | --- | --- |
| **Flat** | No shadow | Default page, hero |
| **Hairline** | `1px` `{colors.hairline}` | Topic cards, viz panel, canvas border |
| **Inverted** | `{colors.surface-dark}` | At most one focal per page |

**No drop shadows** on chrome.

### Imagery

- **No photography** in v1.
- **No mascot** requirement; optional future line icon for brand mark only if it stays single-weight stroke in `{colors.ink}`.

## Shapes

| Token | Radius | Use |
| --- | --- | --- |
| `{rounded.none}` | 0 | Full-bleed structural lines |
| `{rounded.sm}` | 6px | Rare small chips |
| `{rounded.lg}` | **12px** | Topic cards, viz panel, sketch frame |
| `{rounded.full}` | **pill** | Buttons, inputs, selects |

## Components

> Default + active/pressed documented; hover optional and not normative here.

### Buttons

**`button-primary`** — main action (e.g. “Browse topics”, “Run”, “Solve” when it is the sole primary in a group).

- Fill `{colors.primary}`, text white, `{typography.button-md}`, **36px** min height, `8px 20px` padding, `{rounded.full}`.
- Active: `{colors.ink-deep}`.

**`button-secondary`** — outline on canvas.

- White fill, `{colors.ink}` text, **1px** `{colors.hairline-strong}`, same metrics as primary.

**`button-pill-on-dark`** — use **only** inside `{colors.surface-dark}` when an inverted strip exists.

**`button-disabled`** — `{colors.surface-soft}` bg, `{colors.mute}` text, `{rounded.full}`.

### Inputs

**`text-input` / viz toolbar input**

- `{rounded.full}`, **36px** height (or 40px where specified), `8px 16px` padding, `1px` `{colors.hairline}`, mono for numeric fields.

**`install-snippet`**

- Soft gray pill: `{colors.surface-soft}`, `{typography.code-md}`, **48px** min height, **`npm run dev`** (or equivalent) on the home hero—not a third-party installer URL unless we intentionally demo one.

**`command-tag`** (optional)

- Small mono chip for inline hints, e.g. algorithm name or dataset size.

### Cards & panels

**`topic-card`** (index)

- White / canvas bg, **1px** hairline, **12px** radius, **32px** padding, title `{typography.heading-md}`, subtitle `{typography.body-sm}` in `{colors.body}`, difficulty as **soft chip** (no traffic-light colors).

**`viz-panel`** (topic page)

- Wraps sketch + controls: **12px** radius, **1px** border, **16px** padding, no shadow.

**`faq-row`** (future)

- If we add FAQ: question `{typography.heading-sm}`, answer `{typography.body-md}`, hairline between rows.

**`cta-strip-dark`** (future / rare)

- Single dark band for major announcement (e.g. Phase 2).

### Navigation

**`topic-nav`** (sticky header on `/topics/[id]`)

- **56px** height, `{colors.canvas}` bg, **1px** bottom hairline, left **← Home** (link), right **current topic title** (`{typography.body-sm-strong}`, truncate).

### Footer

**`footer-section`**

- **1px** top hairline, `{typography.caption-sm}` `{colors.body}`, center: project tagline + stack credit (e.g. Next.js · p5.js).

### Inline links

- **`link-inline`**: `{colors.ink}`, underlined.
- **`link-mute`**: `{colors.body}`, underlined for low-emphasis prose.

## Visualization (p5) note

Sketches are **pedagogical**, not part of the marketing chrome palette. They may use saturated colors for **nodes, edges, and highlights**. Keep **toolbar UI** aligned with **`button-primary` / `button-secondary` / `text-input`** so the product still reads as one system.

## Do’s and don’ts

### Do

- Keep the shell **flat, light, and monochrome**.
- Use **one primary black pill** per viewport “fold” where possible; use **secondary** for dense viz toolbars.
- Put **real developer copy** in the command pill (`npm run dev`, repo clone, etc.)—it reinforces that this is a **local, hackable** project.
- Reserve **dark inversion** for a **single** emphasis per page.

### Don’t

- Don’t add **gradient heroes**, **glow**, or **brand purple/teal** to global layout.
- Don’t use **shadow elevation** on cards—hairline only.
- Don’t mix **rounded pills** on buttons with **full cards** as pills—cards stay **12px**.

## Responsive behavior

| Breakpoint | Behavior |
| --- | --- |
| ≥1024px | Index 3 columns where space allows; nav stays one row |
| 768–1023px | Index 2 columns |
| &lt;768px | Index 1 column; hero title scales down (~28px); section spacing tightens |
| Touch | Controls target ≥36px height |

Command pill wraps on narrow screens; **don’t** truncate critical commands.

## Iteration guide

1. Change **one component** at a time; keep token names stable (`{colors.primary}`, `{rounded.full}`, …).
2. When adding UI, prefer **existing** pills + hairline panels before inventing tokens.
3. If **DESIGN.md** and **implemented CSS** diverge, update **either** the doc **or** the code in the same change—avoid silent drift.
4. Prefer **English** for user-facing chrome copy (current product default).

## Known gaps

- **No account / billing** flows—design system is marketing + lesson pages only.
- **Hover** micro-interactions not fully specified; keep them subtle.
- **Topic index** may grow to dozens of cards—watch max width and scan-ability.
- **Accessibility**: focus rings required; WCAG contrast for gray-on-white body text is assumed for `{colors.body}` on `{colors.canvas}`.

---

*This document describes **All You Need is CS** (Phase 1: data structures & algorithms). Later phases (OS, networks, papers) should extend this file rather than fork a second aesthetic.*
