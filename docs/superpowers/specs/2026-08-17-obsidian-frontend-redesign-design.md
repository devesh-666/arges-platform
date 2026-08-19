# ARGES — "Obsidian" frontend redesign

**Date:** 2026-08-17
**Status:** Approved (design), implementation in progress
**Branch:** `worktree-obsidian-redesign`, based on `af56d57`

## Goal

Rebuild the entire ARGES frontend on a single premium visual system, add a
scroll-driven explainer that shows what is physically inside the glasses and how
the pipeline works, and connect the dashboards to the API that already exists.

## Why this direction

Sourced from `awesome-design-md/design-md/`. Two specs carry the system:

- **x.ai** — near-black canvas, weight-400 display type with aggressive negative
  tracking, pill-shaped interactives, hairline borders, no shadows. Its
  `accent-sunset` is `#ff7a17`, within a hair of ARGES's own `#FF6B1A`, so the
  premium direction *restores* the brand orange rather than replacing it.
- **Bugatti** — austere luxury: no chrome, no decoration, wide-tracked uppercase
  labels, the product render carries the page. Supplies the restraint.

Rejected: finishing the in-tree Apple re-skin (generic, discards brand orange),
Lamborghini/Ferrari theatrical (120px uppercase shouting fights an accessibility
product), Linear-only (too understated for a landing page).

**Note:** none of the 74 specs contain a motion or animation section — only two
mention an easing curve. The visual language is sourced; the motion system below
is designed for ARGES.

## 1. Token system

```
canvas       #08080C     ink      #FFFFFF
canvas-soft  #101015     body     #DADBDF
canvas-card  #131318     mute     #7D8187
hairline     #212327     accent   #FF6B1A   ← single voltage
hairline-hi  #2E3036     glow     rgba(255,107,26,.40)
```

Status colors exist for dashboard state only: success `#27A644`, warn `#F9A825`,
danger `#E5484D`. They are never used decoratively.

**Type.** Inter at weight **400 only** — never bold. Hierarchy comes from scale
and negative tracking (`-0.04em` at 96px → `-0.02em` at 32px). JetBrains Mono,
uppercase, `+0.24em` for every section eyebrow. Both already load in
`index.html`.

**Shape.** Pill `9999px` on every interactive element, `8px` on cards, `0` on
full-bleed bands. Hairline borders carry all elevation; **no shadows**.

### Two reversals of earlier deliberate decisions

1. **Glassmorphism is retired** as the system default. Every premium reference
   rejects frosted panels and drop shadows in favour of hairlines on near-black.
   One backdrop-blur survives, on the sticky nav.
2. **Per-role accent colors are dropped.** Obsidian is single-voltage. Role
   identity moves to a mono eyebrow label plus icon; orange is the only action
   color. This reverses the `.theme-head` / `.theme-member` / `.theme-helper`
   green/blue/purple scheme.

## 2. Motion system

Five primitives, composed everywhere:

| Primitive | Behaviour | Use |
|---|---|---|
| `rise` | y+24 → 0 + fade, 420ms, 60ms stagger | default entrance |
| `mask-wipe` | clip-path inset reveal | headlines — type "prints" itself |
| `char-cascade` | per-character y + fade | hero display, once per page |
| `hairline-draw` | scaleX 0 → 1, 720ms | band dividers draw themselves |
| `accent-ignite` | orange enters 200ms *after* its content | orange reads as voltage |

Single curve `EASE = [0.16, 1, 0.3, 1]`, already in `animations/index.ts`.
Scroll-tied motion runs **linear** so it never fights the scrollbar. Duration
ladder: 120 / 420 / 720 / 1200ms.

`prefers-reduced-motion: reduce` flattens all of it (the block already exists in
`arges.css`); both scrub sections must ship a static fallback.

## 3. `/3d` — the explainer, four acts

The Flow video ends pushing into the temple arm and the x-ray takes over from
that point — a match cut, so the hybrid reads as one continuous move.

- **Act I — Arrival.** Flow video, scroll-scrubbed over 150vh. The video is
  user-supplied and arrives later, so the component must render a poster
  fallback and accept the file as a drop-in without code changes.
- **Act II — Teardown.** 400vh sticky. Shell fades to 15%; the twelve real
  components illuminate zone by zone (left temple → front frame → right temple),
  each with a mono callout carrying the real part and dimensions. Signal traces
  animate along the real wire channel across both hinges.
- **Act III — Pipeline.** Voice → answer, told as an offline/cloud trust story:
  wake word and OCR on-device, only translation crosses to Bhashini, AES-256
  E2EE, zero-knowledge server, DPDP compliant.
- **Act IV — Close.** CTA band.

### Source of truth for the teardown

`blueprints/blueprint_05_internal.png` (X-ray view, ~174mm temples extended):

| Zone | Components |
|---|---|
| Left temple | USB-C · LiPo 3000mAh 3.7V 50×30×8mm · Speaker 3W 28×28mm · Amp MAX98357 · TP4056 charger |
| Front frame | Mic SPH0645 · Camera pocket 25×24×9mm snap-fit · Wire channel |
| Right temple | Raspberry Pi Zero 2 W 65×30×5mm ("the brain") · GPS NEO-6M (antenna up) · ADXL345 · Switch |

Pipeline per `assets/02_system_architecture.png`: glasses (4K camera, GPS, mic,
HapticBand, fall sensor) → AES-256 E2EE → cloud (LiveKit, Bhashini Indic
STT/TTS, faster-whisper, Supabase) → Family Guardian dashboard → mobile / laptop
/ tablet / watch / smart home / car.

## 4. Pages

| Route | Treatment |
|---|---|
| `/` | Seven full-bleed bands: hero, problem, system, inside-teaser, network, specs table, CTA |
| `/3d` | The four acts above |
| `/login` | One quiet card on canvas |
| `/signup` | 3-step wizard — it transactionally creates head + blind user + family + device pairing |
| `/family` `/member` `/helper` `/admin` | Linear-style density: charcoal panels, hairline rules, mono column headers |

## 5. Wiring the dead API surface

The four dashboards contain **zero** API calls — 2,576 lines rendering hardcoded
arrays (`FamilyDashboard` does not import `useEffect`; `AdminDashboard` holds 20
literal arrays). Only `api.auth.*` is called anywhere, from `Login`, `Signup`,
`useAuth` and `ChangePasswordCard`.

Eight namespaces are fully implemented on both ends and connected to nothing:
`users`, `devices`, `families`, `requests`, `alerts`, `helpers`, `audit`,
`stats`. Wiring them is this project's largest phase and is real engineering,
not styling.

**Constraint:** the backend's mock-mode branch means the demo runs with or
without MongoDB. Every endpoint touched must keep both branches working.

## 6. Deliverable: Google Flow prompt

```
Extreme macro cinematography of a matte-black titanium smart-glasses frame
resting on black glass in a dark studio. Camera glides slowly left to right
along the temple arm toward the hinge, then pushes in close on the temple.
Shallow depth of field, focus racking from the lens bezel to the hinge.
A single warm amber light (#FF6B1A) rakes across from the right, catching
the chamfered edge and the small circular camera lens in the front frame.
Volumetric haze, faint dust motes. Background pure black.
Anamorphic 2.39:1, 35mm, T1.4, fine film grain, locked-off smooth motion,
one continuous take, slow and deliberate, no cuts.
Palette: near-black with a single amber accent and nothing else.
```

Negative: `text, logos, watermarks, hands, faces, people, UI overlays, bright or
white background, rainbow lens flare, fast cuts, camera shake, multiple light
colors`

The closing push-in is required — Act II's match cut depends on it.

## Non-goals

- No new 3D asset work. `arges_glasses.glb` is a single unnamed mesh with one
  material and no animations, so an exploded 3D view is not available; the
  teardown is built as SVG instead.
- No change to backend routes beyond what wiring the dashboards requires.
- No route guards. Dashboards stay reachable without auth (demo).
