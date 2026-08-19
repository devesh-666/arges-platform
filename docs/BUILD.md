# ARGES — how the site is built

The complete build reference for the ARGES frontend: the design system, the
motion system, the component set, and how each page is assembled.

Stack: React 19 · Vite 8 · Tailwind v4 (no config file, via `@tailwindcss/vite`)
· Framer Motion · react-router-dom 7 · Three.js on two surfaces.

---

## 1 · Commands

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173, proxies /api → :3001
npm run build    # tsc -b && vite build → dist/
npm run lint     # oxlint
```

```bash
cd backend
npm install
npm run dev      # http://localhost:3001
npm run seed     # wipes and reseeds MongoDB
```

There is **no test suite** — no runner, no test files. Changes are verified by
running both servers and exercising the UI, or by curling the API.

Two environment notes: Vite binds IPv6 here, so use `localhost:5173` rather than
`127.0.0.1:5173`; and stale node servers accumulate across sessions, so check
what is already listening before assuming a port is free.

---

## 2 · Source layout

```
frontend/src/
  obsidian.css              the design system — the single source of truth
  index.css                 imports obsidian.css + two Tailwind helpers
  animations/obsidian.ts    the five motion primitives
  lib/
    api.ts                  the only place that talks to the backend
    media.ts                video slot paths
  hooks/
    useApiData.ts           loading / error / refetch for every data panel
    useAuth.ts              token in localStorage, hydrated via /auth/me
  components/
    Primitives.tsx          Reveal, RevealGroup, Rule, SectionHead, CharCascade, Ignite, Logo
    SiteChrome.tsx          SiteNav + SiteFooter (marketing pages)
    DashShell.tsx           DashShell + Stat + Panel + DataState (dashboards)
    XRayTeardown.tsx        the cutaway diagram + the real bill of materials
    ScrubVideo.tsx          scroll-driven video
    AmbientVideo.tsx        looping video
    Cursor.tsx              dot + ring pointer overlay
    GlassesViewer3D.tsx     the GLB model
    ChangePasswordCard.tsx  shared by all four dashboards
  pages/
    Landing.tsx  HowItWorks3D.tsx  Login.tsx  Signup.tsx
    FamilyDashboard.tsx  MemberDashboard.tsx  HelperDashboard.tsx  AdminDashboard.tsx
```

Routes, one per role, all lazy-loaded except `Landing`:

`/` · `/login` · `/signup` · `/3d` · `/family` · `/member` · `/helper` · `/admin`

There are **no route guards**. Dashboards are reachable without auth, by design,
so the demo can be driven without signing in.

---

## 3 · The design system — "Obsidian"

Everything lives in `src/obsidian.css`. Derived from two specs in
`awesome-design-md/design-md/`: **x.ai** supplies the canvas, the weight-400
display type with hard negative tracking, the pill interactives and hairline
elevation; **Bugatti** supplies the restraint — no chrome, no decoration, the
product render carries the page.

The direction works because x.ai's `accent-sunset` is `#ff7a17`, effectively the
ARGES orange. Going premium *restored* the brand colour rather than replacing it.

### Tokens

```css
/* Surface */
--canvas:       #08080C;
--canvas-soft:  #101015;
--canvas-card:  #131318;
--canvas-mid:   #1A1A21;
--hairline:     #212327;
--hairline-hi:  #2E3036;

/* Ink */
--ink:   #FFFFFF;
--body:  #DADBDF;
--mute:  #7D8187;
--faint: #4E5157;

/* The single voltage */
--accent:      #FF6B1A;
--accent-hi:   #FF8533;
--accent-soft: #FFC285;
--glow:        rgba(255,107,26,0.40);
--accent-wash: rgba(255,107,26,0.08);

/* State — dashboards only, never decorative */
--ok: #27A644;  --warn: #F9A825;  --danger: #E5484D;

/* Type */
--font: 'Inter', -apple-system, system-ui, sans-serif;
--mono: 'JetBrains Mono', ui-monospace, monospace;

/* Rhythm — 4px base */
--s1: 4px;  --s2: 8px;   --s3: 12px;  --s4: 16px;  --s5: 24px;
--s6: 32px; --s7: 48px;  --s8: 64px;  --s9: 96px;  --s10: 128px;

--radius: 8px;   --pill: 9999px;
--ease: cubic-bezier(0.16, 1, 0.3, 1);
--t-micro: 120ms;  --t-element: 420ms;  --t-section: 720ms;
```

Legacy aliases (`--orange`, `--white`, `--muted`, `--glass`…) map onto the new
tokens so anything unmigrated still resolves. **Do not author new rules against
them.**

Both fonts load via `<link>` in `index.html`. Inter and JetBrains Mono are
already in that request.

### The four rules

Ordered by how easily they break.

1. **Display type is always weight 400.** Hierarchy comes from scale plus
   negative tracking — `-0.04em` at the top of the ladder easing to `-0.02em`
   at the bottom. Bolding a headline destroys the voice instantly. The tracking
   scaling *with* size is the entire signature; flatten it and the type reads
   generic.
2. **Orange marks action and state, never decoration.** One accent button per
   view, on the true primary action. Everything else is an outline pill.
3. **Elevation is a 1px hairline.** There are no box-shadows on surfaces
   anywhere in the system.
4. **Every interactive is a pill** (`9999px`). Cards are `8px`. Full-bleed
   bands are `0`.

### Type scale

| Class | Size | Tracking |
|---|---|---|
| `.display-xl` | `clamp(2.75rem, 7.5vw, 6rem)` | `-0.04em` |
| `.display-lg` | `clamp(2.25rem, 5.5vw, 4.5rem)` | `-0.035em` |
| `.display-md` | `clamp(1.75rem, 3.6vw, 3rem)` | `-0.03em` |
| `.display-sm` | `clamp(1.35rem, 2.2vw, 2rem)` | `-0.02em` |
| `.lead` | 1.125rem / 1.65 | — |
| `.eyebrow` | 0.6875rem mono, uppercase | `+0.24em` |

`.eyebrow` is the signature label — mono, uppercase, widely tracked, so it reads
as a code comment rather than a marketing kicker. Every band opens with one.

### Component classes

```
.shell          max-width 1200px, centred, side padding
.band           vertical section rhythm
.rule           1px hairline, transform-origin left (so it can draw itself)

.btn            base — transparent, pill, 1px transparent border
.btn-outline    the default CTA — white translucent border
.btn-accent     the voltage — solid orange, one per view
.btn-ghost      muted text only
.btn-sm .btn-lg size variants

.card           canvas-card + hairline + 8px
.card-live      opt-in, marks the one card that matters (orange-tinted)
.panel          canvas-soft + hairline + 8px

.field .field-label .input        forms
.tag .tag-ok .tag-warn .tag-danger .tag-accent    status
.dot .dot-pulse                   status indicator

.dash .sidebar .nav-item .dash-main .dash-head    dashboard shell
.grid-stats .stat .stat-label .stat-value .stat-delta
.table-wrap .table                data tables

.cursor-dot .cursor-ring          pointer overlay
.skip-link .sr-only               accessibility
```

### Two cascade hazards

**The universal reset must stay inside `@layer base`.** Unlayered, it outranks
Tailwind's layered utilities and silently kills every padding, margin and
max-width utility in the app. Same reasoning puts `.font-display` / `.font-mono`
in `@layer components` so Tailwind utilities on the same element still win.

**A class used in TSX with no rule anywhere fails silently** and can wreck
layout — an unsized `.activity-icon svg` once stretched a page to 6000px. When
adding markup, confirm the class exists in `obsidian.css` first.

### Texture

One texture only: a fixed film-grain overlay on `body::after` at 16% opacity
with `mix-blend-mode: overlay`, built from an inline SVG `feTurbulence`. It adds
richness without adding chrome. It is disabled under reduced motion.

---

## 4 · The motion system

`src/animations/obsidian.ts`. Designed rather than sourced — none of the 74
specs in `awesome-design-md` define motion; they all stop at colour, type and
surface.

Five primitives that compose, instead of a per-component menagerie:

| Primitive | Behaviour | Use |
|---|---|---|
| `rise` | y+24 → 0 + fade, 420ms, 60ms stagger | the default entrance |
| `maskWipe` / `maskLine` | clip-path or masked line reveal | headlines — type appears printed |
| `charGroup` + `charItem` | per-character reveal | hero display, **once per page** |
| `hairlineDraw` | scaleX 0 → 1, 720ms | band dividers draw themselves |
| `accentIgnite` | enters 200ms **after** its content | makes orange read as voltage |

Supporting exports: `EASE` (the single curve, `[0.16, 1, 0.3, 1]`), `T` (the
duration ladder — micro 0.12 / element 0.42 / section 0.72 / cinematic 1.2),
`inView` (viewport config, reveal once), `chars()` (string → character array).

### Two rules worth the ink

**Scroll-tied motion must be linear.** An ease curve applied to a value driven
by `scrollYProgress` fights the scrollbar — the element lags the thumb and the
page feels broken rather than smooth. `EASE` is for time-driven motion only.

**`accentIgnite`'s 200ms delay is the whole primitive.** Remove it and the
accent stops reading as voltage and becomes decoration.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` in `obsidian.css` flattens all
animation and drops the grain. That is not sufficient on its own for the two
scroll-scrubbed sections, where meaning is carried by the scroll itself — those
components each detect the setting and render a **static completed state**
instead. Any new scroll-driven section must do the same.

---

## 5 · Component contracts

### Primitives

- **`<Reveal delay className as>`** — scroll-revealed block, the workhorse.
- **`<RevealGroup>`** — stagger parent. Variants propagate through React
  context, so plain `<ul>` / `<div>` between the group and its `motion.li`
  children is fine.
- **`<Rule>`** — a hairline that draws itself into view.
- **`<CharCascade text>`** — per-character hero reveal. Exposes the full string
  via `aria-label` and hides the animated spans, so a screen reader hears one
  heading rather than a stream of single letters.
- **`<SectionHead eyebrow title lead>`** — the standard opening of every band.
- **`<Logo size color>`** — the single mark, one path set.

### Video

Two components, one contract: the file is user-supplied, may be absent, and
**nothing throws or renders broken**.

- **`<ScrubVideo src poster progress>`** — playhead driven by scroll position
  rather than time. Seeks are coalesced through `requestAnimationFrame`, because
  assigning `currentTime` on every scroll event queues seeks faster than the
  decoder retires them and stutters badly on mobile Safari. Sub-frame seeks are
  skipped. Falls back to the poster.
- **`<AmbientVideo src poster variant vignette>`** — looping, muted, decorative.
  `variant="background"` fills its parent; `variant="inline"` renders a 2.39:1
  framed strip. With no file it paints an amber-wash placeholder graded to the
  palette, so a missing clip reads as an intentional surface. Autoplay is
  suppressed entirely under reduced motion, and a rejected `play()` promise is
  swallowed rather than treated as an error.

Slot paths live in `src/lib/media.ts`; files go in `frontend/public/media/`.
Every slot is optional — the site is complete with none of them present.

### Dashboard set

- **`<DashShell role sections active onNavigate title subtitle actions>`** —
  shared chrome for all four roles.
- **`<Stat label value note tone>`** — a metric. `tone` marks state only.
- **`<Panel title actions>`** — section container with a hairline heading.
- **`<DataState loading error empty>`** — the single consistent
  loading / error / empty treatment. Every data panel wraps its content in one.

---

## 6 · Page build specs

### Landing — `/`

Full-bleed bands, in order:

1. **Hero.** The GLB model behind the type at 75% opacity, radial vignette over
   it, `CharCascade` on both headline lines, the Greek line
   (`Ἄργης · "THE BRIGHT ONE"`) in mono, lead paragraph, two CTAs, then a
   four-stat row (15M+ blind in India · ₹9,999 · 8 industry firsts · 5-layer
   ecosystem). The render is decorative and `aria-hidden`.
2. **Why it exists.** Full-bleed ambient video, claim overlaid.
3. **01 — Ecosystem.** Five cards.
4. **02 — Inside.** Section head, the full `XRayTeardown` in `showAll` mode, an
   inline ambient strip with the HapticBand note, CTA into `/3d`.
5. **03 — Capability.** Eight features in a hairline-gapped grid.
6. **04 — Pricing.** Three tiers; the middle one carries `.card-live` and the
   only accent CTA.
7. **05 — Questions.** Six-item accordion, `aria-expanded`, height animated.
8. **Close.** Ambient video background, headline, two CTAs.

### `/3d` — the explainer

Four acts. See §7.

### `/login`

One quiet card. Both buttons hit the same endpoint — the backend supports a
passkey path where a user with no password set authenticates on email alone, so
the only difference is whose address is submitted. Role determines the redirect.

### `/signup`

Four-step wizard: Account → Device → Wearer → Done, with a progress hairline.

The wizard exists because signup is **one backend transaction** that creates the
family head, the blind user, the `Family` document and the device pairing
together — too much for one screen. Every field is controlled and everything
collected is submitted. Pairing offers NFC / manual code / QR; the demo device
is `ARG-7K3M9-P2Q8R-4X`.

### Dashboards

Density borrowed from Linear: charcoal panels, hairline rules, mono column
headers, tabular numerals on figures.

| Route | Role | Sections |
|---|---|---|
| `/family` | Family head | Overview · Device · Location · Members · Consent requests · Alerts · Security |
| `/member` | Family member | Overview · Request access · Viewing history · Location · Security |
| `/helper` | Echo helper | Dashboard · Open requests · Session history · The network · Security |
| `/admin` | Administrator | Dashboard · Server health · Users · Devices · Family trees · Helpers · Alerts · Audit log · Security |

**Role identity is a mono label, not a hue.** Obsidian is single-voltage, so the
earlier per-role green/blue/purple scheme is gone and must not be restored.
Orange is the only action colour everywhere; green/amber/red survive strictly as
state.

---

## 7 · The `/3d` explainer

**Act I — Arrival.** `ScrubVideo` over a 150vh sticky range. The film ends
pushing into the temple arm.

**Act II — Teardown.** 400vh sticky. Scroll progress walks three zones: the
shell dims to 15%, components illuminate zone by zone, and a signal trace
animates along the real wire channel across both hinges.

Act I's final frame and Act II's opening are the **same camera position**. That
match cut is what makes generated footage and a built diagram read as one
continuous move rather than two stacked sections. If the hero clip is ever
regenerated, it must keep the closing push-in.

**Act III — Pipeline.** Five steps as a trust story: four never leave the
device, and only translated text — never the image — crosses to Bhashini.

**Act IV — Close.**

Between II and III sits a full-bleed ambient interlude.

### The teardown is documentation

`XRayTeardown.tsx` is drawn from `blueprints/blueprint_05_internal.png`. Every
part, dimension and coordinate is the real bill of materials, laid out in the
blueprint's own flat "temples-extended" projection (~174mm) so the two can be
compared side by side.

| Zone | Components |
|---|---|
| Left temple | USB-C · LiPo 3000mAh 3.7V 50×30×8mm · Speaker 3W 28×28mm · MAX98357 amp · TP4056 charger |
| Front frame | SPH0645 I²S MEMS mic · camera pocket 25×24×9mm snap-fit · wire channel |
| Right temple | Pi Zero 2 W 65×30×5mm ("the brain") · NEO-6M GPS, antenna up · ADXL345 · switch |

**If the hardware changes, this file changes with it.**

Parts are *not* colour-coded by category the way the blueprint is — single
voltage means an illuminated part is orange and a dormant one is a hairline.
Category lives in the label instead.

The zone rail and parts list beside the diagram are also its accessible
rendering: every part is real text, and the SVG carries a descriptive
`aria-label`.

**Why SVG and not 3D:** `arges_glasses.glb` is a single unnamed mesh with one
material and no animations. It has no separable internals, so an exploded 3D
view is not available without new asset work.

---

## 8 · Data layer

`src/lib/api.ts` is the only place that talks to the backend — a namespaced
client over a `fetch` wrapper that injects
`Authorization: Bearer <localStorage['arges_token']>`. Base URL is
`VITE_API_URL || '/api'`.

Namespaces: `auth` · `users` · `devices` · `families` · `requests` · `alerts` ·
`helpers` · `audit` · `stats`.

`useApiData(fetcher, fallback, deps)` wraps a call and returns
`{ data, loading, error, refetch }`. A failed request is **not** fatal — `data`
keeps its fallback so a panel renders empty rather than collapsing the page. The
fetcher is a fresh closure each render so it cannot be a dependency without
looping; pass `deps` for anything that should re-trigger.

`field(row, key, fallback)` reads an unknown API record without a schema layer.
Its return type is widened from the fallback: without that, `field(r,'status','')`
would infer the literal type `""` and every later `=== 'pending'` comparison
would be a type error.

### The rule for any new endpoint

`connectDB()` swallows connection failures and logs "mock mode" instead of
exiting, and every backend route branches on `isConnected()`:

```ts
if (isConnected()) { /* real Mongoose query */ } else { /* fixtures */ }
```

The backend therefore always boots and always answers, with or without a
database — that is how the demo runs. **Any new endpoint must implement both
branches** or it silently breaks the no-DB path. `GET /health` reports which
mode is active.

Working mutations: suspend / reinstate users, lock / unlock devices, respond to
consent requests, resolve alerts. The device and user PATCH handlers diff old
against new document state to decide which transactional email to send, so
changing status really does notify the account.

---

## 9 · Accessibility

Baked in, not retrofitted:

- `.skip-link` on every page, first focusable element.
- Focus is always visible — a 2px accent outline at 3px offset on every
  interactive, via `:focus-visible`.
- `CharCascade` exposes the whole string to assistive tech and hides the
  per-character spans.
- Decorative surfaces (the GLB hero, every video, the vignettes) are
  `aria-hidden`.
- The teardown diagram has a descriptive `aria-label`, and its parts list is
  real text beside it.
- Dashboard nav uses `aria-current`; the FAQ uses `aria-expanded`; status
  messages use `role="status"` and errors `role="alert"`.
- Tables use real `<th>` with scope where the header is a row label.
- `prefers-reduced-motion` flattens everything, and scroll-driven sections
  render a static completed state.

Colour is never the only signal — every status tag pairs its colour with a text
label.

---

## 10 · Build constraints

**Bundle splitting.** `vite.config.ts` manually chunks react, framer-motion,
three and leaflet vendors. Three.js is ~648KB and trips the 600KB warning; it is
lazy-loaded so it only downloads on pages that mount the model.

**Aliases.** `@` → `src`, `@shared` → `../shared`.

**Windows / OneDrive.** Paths contain spaces — quote them. Git warns LF→CRLF on
every frontend file; that is expected.

**`shared/types.ts`** is checked in alongside compiled `types.js` / `types.d.ts`.
Edit the `.ts`.

**`backend/.env` holds real credentials.** Never read it into context, echo it,
or copy values into code or docs.

---

## 11 · Verifying a change

There is no test suite, so:

```bash
cd frontend
npx tsc -b        # must be silent
npm run lint      # oxlint
npm run build     # must succeed
```

Then run both servers and walk all eight routes. For anything touching data,
confirm the endpoint answers through the proxy:

```bash
curl -s http://localhost:5173/api/stats
```

And check it still works in **both** database states — connected and mock.
