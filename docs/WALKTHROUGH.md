# ARGES — Obsidian build walkthrough

Everything needed to run, finish and ship the redesigned frontend.

- **Branch:** `worktree-obsidian-redesign` (pushed to `origin`)
- **Worktree:** `arges-platform/.claude/worktrees/obsidian-redesign`
- **PR:** https://github.com/devesh-666/arges-platform/pull/new/worktree-obsidian-redesign

Your in-progress Apple re-skin is untouched in your own checkout. This branch
was cut from `af56d57`, before it.

---

## 0 · What state things are in

| Piece | Status |
|---|---|
| Design system (Obsidian) | Done |
| Motion system | Done |
| Landing, `/3d`, `/login`, `/signup` | Done |
| 4 dashboards + API wiring | Done |
| Five video slots | Built, **files not installed yet** |
| Visual QA | **Not done** — see §1 |

Verified by build, not by eye: `tsc` clean, `oxlint` clean, production build
succeeds, all eight API endpoints answer 200 through the Vite proxy. Nobody has
actually *looked* at the site yet. That is step one.

---

## 1 · Run it locally

Two terminals, both from the worktree.

```bash
cd "arges-platform/.claude/worktrees/obsidian-redesign/backend"
npm install     # first time only
npm run dev     # http://localhost:3001
```

```bash
cd "arges-platform/.claude/worktrees/obsidian-redesign/frontend"
npm install     # first time only
npm run dev     # http://localhost:5173
```

Open **http://localhost:5173** and walk every route:

`/` · `/3d` · `/login` · `/signup` · `/family` · `/member` · `/helper` · `/admin`

The backend prints `Mock Mode (no DB)` unless Mongo is running on 27017. That is
correct and expected — every route answers from fixtures in that state, which is
how the demo is meant to run. Admin → *Server health* shows this in amber.

**If a browser can't connect:** Vite binds IPv6 (`::1`) here. Use
`http://localhost:5173`, not `127.0.0.1:5173`. To bind both stacks:
`npm run dev -- --host`.

**If a port is taken:** stale node servers accumulate across sessions. List and
clear them:

```powershell
Get-NetTCPConnection -State Listen |
  Where-Object { $_.LocalPort -eq 3001 -or ($_.LocalPort -ge 5173 -and $_.LocalPort -le 5190) } |
  Select-Object LocalPort,OwningProcess
```
```powershell
Stop-Process -Id <pid> -Force
```

---

## 2 · Install the five videos ← **do this next**

The clips are in `Main project/video/`. The slots are already built and waiting.

### 2.1 Fix the filenames

Two exports have a doubled extension. The site will not find them as-is:

| In `video/` | Must become |
|---|---|
| `arges-hero.mp4.mp4` | `arges-hero.mp4` |
| `arges-signal.mp4.mp4` | `arges-signal.mp4` |
| `arges-morning.mp4` | unchanged |
| `arges-contact.mp4` | unchanged |
| `arges-network.mp4` | unchanged |

Names must match **exactly**. See §8 for why a typo fails silently.

### 2.2 Check what you have

`arges-hero`, `arges-signal` and `arges-morning` were probed and are each
1920×1080 · 24fps · H.264 · 10.0s, carrying an AAC track that should be
stripped (all five play muted). `arges-contact` and `arges-network` were not
probed — check them before encoding. File sizes across the set run 3.5–7.5MB.

Confirm any file with:

```bash
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate \
  -show_entries format=duration,size -of default=noprint_wrappers=1 arges-hero.mp4
```

ffmpeg is already installed on this machine and on `PATH`.

### 2.3 Encode

Run these from `Main project/video/`. Output goes straight into the site.

`OUT` is the media folder inside the worktree:

```bash
OUT="../arges-platform/.claude/worktrees/obsidian-redesign/frontend/public/media"
```

**The hero — dense keyframes required.** This clip is seeked continuously by
scroll position. A normal export places keyframes ~2s apart, so every seek
decodes a whole chunk and the scrub stutters badly on phones. `-g 6` puts one
every 6 frames:

```bash
ffmpeg -i arges-hero.mp4.mp4 -an -g 6 -c:v libx264 -crf 23 \
  -movflags +faststart "$OUT/arges-hero.mp4"
```

**The other four — they only loop, never seek.** A plain re-encode is enough;
`-an` strips the audio track:

```bash
ffmpeg -i arges-signal.mp4.mp4 -an -c:v libx264 -crf 23 -movflags +faststart "$OUT/arges-signal.mp4"
ffmpeg -i arges-morning.mp4    -an -c:v libx264 -crf 23 -movflags +faststart "$OUT/arges-morning.mp4"
ffmpeg -i arges-contact.mp4    -an -c:v libx264 -crf 23 -movflags +faststart "$OUT/arges-contact.mp4"
ffmpeg -i arges-network.mp4    -an -c:v libx264 -crf 23 -movflags +faststart "$OUT/arges-network.mp4"
```

Target under ~8MB each. `arges-contact.mp4` starts at 7.5MB, so if it lands over
budget push `-crf` to 26 — it is a dark macro shot and will hold up fine.

### 2.4 Verify

```bash
ls -la frontend/public/media/
```

Five `.mp4` files plus `README.md`. Then reload the site and check each slot:

| Scene | File | Where to look |
|---|---|---|
| 1 | `arges-hero.mp4` | `/3d` — scroll slowly through the opening; the frame should track your scroll, not play on its own |
| 2 | `arges-signal.mp4` | `/3d` — band between the teardown and the pipeline |
| 3 | `arges-morning.mp4` | `/` — full-bleed, directly under the hero |
| 4 | `arges-contact.mp4` | `/` — inline strip inside the "02 — Inside" band |
| 5 | `arges-network.mp4` | `/` — behind the closing headline and CTA buttons |

**What to judge:** on scenes 3 and 5 the overlaid text must stay readable. If a
clip is too bright behind the type, raise the vignette in
`src/components/AmbientVideo.tsx` (the `rgba(8,8,12,0.72)` stop) rather than
regrading the video.

### 2.5 Commit

```bash
git add frontend/public/media
git commit -m "Add the five scene videos"
git push
```

---

## 3 · What was built

### The direction

Sourced from `awesome-design-md/design-md/`, which holds 74 real design specs.
Two carry this system:

- **x.ai** — near-black canvas, weight-400 display type with hard negative
  tracking, pill interactives, hairline borders, no shadows. Its `accent-sunset`
  is `#ff7a17`, which is effectively your `#FF6B1A`. That is the whole reason
  this direction works: going premium *restored* the ARGES orange instead of
  replacing it with Apple blue.
- **Bugatti** — austere restraint. No chrome, no decoration, the render carries
  the page.

Rejected: finishing the Apple re-skin (generic, loses the orange),
Lamborghini/Ferrari theatrical (120px uppercase shouting fights an
accessibility product), Linear-only (too quiet for a landing page).

### Two deliberate reversals

Both undo earlier decisions on purpose. Do not "restore" them.

1. **Glassmorphism is retired.** Every premium reference rejects frosted panels
   and drop shadows for hairlines on near-black. One backdrop-blur survives, on
   the sticky nav.
2. **Per-role accent colours are dropped.** A single-voltage system cannot carry
   four hues. Role identity is now a mono label under the wordmark; orange is
   the only action colour. Green/amber/red survive **only** as state.

---

## 4 · The design system

`src/obsidian.css` is the whole system. `src/index.css` just imports it.

```
canvas       #08080C     ink      #FFFFFF
canvas-soft  #101015     body     #DADBDF
canvas-card  #131318     mute     #7D8187
hairline     #212327     accent   #FF6B1A   ← the only accent
hairline-hi  #2E3036     faint    #4E5157
```

State, dashboards only: `--ok #27A644` · `--warn #F9A825` · `--danger #E5484D`

**Four rules, in order of how easily they break:**

1. Display type is **always weight 400**. Hierarchy comes from scale plus
   negative tracking (`-0.04em` at the top of the scale easing to `-0.02em`).
   Bolding a headline breaks the voice immediately.
2. Orange marks **action and state, never decoration**.
3. Elevation is a **1px hairline**. There are no box-shadows on surfaces.
4. Every interactive is a **pill** (`9999px`). Cards are `8px`. Bands are `0`.

### The motion system

None of the 74 specs define motion — they stop at colour, type and surface. So
`src/animations/obsidian.ts` is designed, not sourced. Five primitives:

| Primitive | Behaviour |
|---|---|
| `rise` | y+24 → 0 + fade, 420ms, 60ms stagger — the default entrance |
| `maskWipe` | clip-path reveal, so type appears printed rather than faded |
| `charCascade` | per-character reveal — **once per page**, hero only |
| `hairlineDraw` | scaleX 0 → 1, every band divider draws itself |
| `accentIgnite` | orange enters **200ms after** its content |

Two rules that cost real debugging time if broken:

- **Scroll-tied motion must be linear.** An ease curve on a value driven by
  `scrollYProgress` fights the scrollbar — the element lags the thumb and the
  page feels broken. `EASE` is for time-driven motion only.
- **`accentIgnite`'s 200ms delay is the point.** Remove it and orange stops
  reading as voltage and starts reading as decoration.

Everything respects `prefers-reduced-motion`, and both scroll-scrubbed sections
ship a static fallback — flattening transitions is not enough when the meaning
is carried by the scroll itself.

---

## 5 · The `/3d` explainer

Four acts. The hinge is between I and II.

**Act I — Arrival.** `ScrubVideo` over 150vh. The film ends pushing into the
temple arm.

**Act II — Teardown.** 400vh sticky. The shell dissolves and twelve components
illuminate zone by zone. **Act I's final frame and Act II's opening are the same
camera position** — that match cut is what makes generated footage and a built
diagram read as one continuous move instead of two stacked sections. If the hero
clip is ever regenerated, keep the closing push-in or this breaks.

**Act III — Pipeline.** Voice → answer as a trust story: four of five steps never
leave the device; only translated text crosses to Bhashini.

**Act IV — Close.**

### The teardown is real

`src/components/XRayTeardown.tsx` is drawn from
`blueprints/blueprint_05_internal.png`. Every part, dimension and position is
your actual bill of materials, laid out in the blueprint's own flat
"temples-extended" projection (~174mm) so the two can be compared side by side.

| Zone | Components |
|---|---|
| Left temple | USB-C · LiPo 3000mAh 3.7V 50×30×8mm · Speaker 3W 28×28mm · MAX98357 amp · TP4056 charger |
| Front frame | SPH0645 mic · camera pocket 25×24×9mm snap-fit · wire channel |
| Right temple | Pi Zero 2 W 65×30×5mm · NEO-6M GPS (antenna up) · ADXL345 · switch |

**If the hardware changes, this file changes with it.** It is documentation, not
decoration.

Note there is no exploded 3D view: `arges_glasses.glb` is a single unnamed mesh
with one material and no animations, so it has no separable internals. The SVG
teardown exists because of that constraint.

---

## 6 · Dashboards and the API

### What was wrong

The four dashboards were 2,576 lines rendering hardcoded arrays with **zero API
calls** — `FamilyDashboard` did not even import `useEffect`. Meanwhile eight
namespaces were fully implemented on both frontend and backend and called by
nothing: `users`, `devices`, `families`, `requests`, `alerts`, `helpers`,
`audit`, `stats`. Only `api.auth.*` was ever used.

Signup's inputs were not controlled — it posted hardcoded values. Login's email
field only faked a "magic link sent".

### What it is now

All eight are wired. `src/hooks/useApiData.ts` handles loading / error / refetch;
`src/components/DashShell.tsx` is the shared chrome.

Working actions: suspend and reinstate users, lock and unlock devices, respond
to consent requests, resolve alerts, read the audit log, live server health.
Signup and Login submit what is actually typed.

### The rule for any new endpoint

`connectDB()` swallows connection failures and logs "mock mode" instead of
exiting, and every route branches on `isConnected()`:

```ts
if (isConnected()) { /* real Mongoose query */ } else { /* fixtures */ }
```

**Any new endpoint must implement both branches** or it silently breaks the
no-DB demo path.

### Admin sections not built

Five of the original fifteen were dropped rather than shipped as fake panels,
because no data source exists behind them: analytics charts, financial, user
map, face verify, OTA updates. The other ten are real.

---

## 7 · Deploy

Both targets are already provisioned.

**Frontend → Netlify.** `arges-vision-web.netlify.app` is production;
`arges-vision.netlify.app` is the older site kept alive for old links.

```bash
cd frontend && npm run build
npx netlify deploy --prod --dir=dist
```

Three SPA-fallback configs exist and are **not** redundant — repo-root
`netlify.toml` (sets `base = "frontend"` for Git-connected builds),
`frontend/netlify.toml` (CLI builds), and `frontend/public/_redirects` (ships
inside `dist/` itself). If you touch routing or the `.glb` headers, update every
copy that applies.

**Backend → Render.** `arges-vision-api.onrender.com`, `autoDeploy: true`, so
**pushing this repo to `main` redeploys the backend.**

`frontend/.env.production` must hold the absolute API URL —
`VITE_API_URL=https://arges-vision-api.onrender.com/api`. Netlify serves static
files only, so a relative `/api` 404s against the CDN.

**Before merging to main:** do the visual QA in §1. Nothing here has been seen.

---

## 8 · Gotchas

**A misspelled video filename fails silently.** The SPA redirect returns
`index.html` with a **200** for any unmatched path, so a missing
`/media/foo.mp4` serves HTML, not a 404. The `<video>` element rejects it and
falls back to the placeholder, which is correct behaviour — but it means a typo
looks exactly like a missing file. Check the spelling before blaming the encode.

**Vite binds IPv6 only here.** `localhost:5173` works; `127.0.0.1:5173` may not.

**Stale dev servers accumulate.** Seven were running at once during this build,
including a backend two days old that was answering health checks. Clear them
before trusting local results (§1).

**A class used in TSX with no CSS rule fails silently** and can wreck layout —
an unsized `.activity-icon svg` once stretched the admin page to 6000px. When
adding markup, confirm the class exists in `obsidian.css`.

**The universal reset must stay inside `@layer base`.** Unlayered it outranks
Tailwind's layered utilities and silently kills every padding, margin and
max-width utility in the app.

**`backend/.env` holds real credentials.** Never read it into context, echo it,
or copy values into code or docs.

---

## Appendix A · The video prompts

Kept for regeneration. Every clip is graded near-black with a single amber
accent and an empty background, so it composites onto the canvas invisibly.

### Shared style block — prepend to every prompt

```
STYLE: Anamorphic 2.39:1 widescreen, 35mm film look, T1.4 shallow depth of
field, fine natural film grain, cinematic colour grade.
BACKGROUND: Pure black empty void. Completely empty background with no
environment, no set, no props, no furniture, no walls, no floor line, no
horizon, no visible studio. Background falls off to solid black (#000000).
LIGHTING: One single warm amber light source (#FF6B1A) only. No fill light.
Deep shadows, most of the frame in darkness.
COLOUR: Near-black and warm amber only. No other colour anywhere.
MOTION: Slow, deliberate, smooth. One continuous take. No cuts, no camera
shake, no zoom snaps.
```

### Universal negative

```
text, letters, numbers, logos, watermarks, subtitles, UI overlays, captions,
background objects, furniture, walls, windows, doors, plants, curtains, desks,
shelves, studio equipment, light stands, reflections of a room, crowds, extra
people, bright background, white background, grey background, daylight, sky,
blue light, green light, purple light, neon, rainbow lens flare, fast cuts,
jump cuts, camera shake, handheld wobble, zoom, distorted hands, extra fingers
```

### Scene 1 · The Approach — `arges-hero.mp4`

```
Extreme macro cinematography of a matte-black titanium smart-glasses frame
lying on a black glass surface.

ACTION: The camera glides slowly and steadily from left to right along the
temple arm, travelling toward the hinge. In the final two seconds it pushes
in close on the temple arm and holds. Focus racks gently from the lens bezel
to the hinge as it travels.

SUBJECT DETAIL: Slim matte-black frame, chamfered edge catching the light, a
small circular camera lens set into the front frame, a visible hinge joint.
Industrial, precise, understated. No branding of any kind.

CAMERA: 35mm macro, T1.4, very shallow depth of field, locked-off smooth
dolly move, constant speed.

LIGHTING: A single warm amber light rakes across from the right, grazing the
chamfered edge and glinting off the camera lens. Everything else falls into
darkness. Faint volumetric haze and a few slow dust motes drifting.

BACKGROUND: Pure black empty void. The glass surface disappears into black —
no table edge, no horizon, no room, nothing behind the frame.
```

### Scene 2 · Signal — `arges-signal.mp4`

```
Abstract extreme macro of a single thread of warm amber light travelling
along a narrow dark brushed-metal channel, like current moving through a
circuit.

ACTION: The light enters from the left, accelerates smoothly along the
channel, splits into two threads at the midpoint, then rejoins into one and
continues out of frame right. It pulses gently twice as it travels.

CAMERA: 85mm macro, T1.4, extremely shallow depth of field. The camera tracks
alongside the light at matched constant speed, keeping it centred.

LIGHTING: The amber light IS the only light source. It illuminates a narrow
strip of brushed metal texture beneath it and nothing else.

BACKGROUND: Pure black empty void surrounding the channel. No circuit board,
no components, no device visible. Only the lit strip of metal and blackness.
Soft out-of-focus amber bokeh particles drifting slowly in the dark.
```

### Scene 3 · Alone, Unaided — `arges-morning.mp4`

```
Cinematic shot of a person from behind and slightly to one side, from the
shoulders up, walking forward at a calm confident pace.

ACTION: They walk steadily away from camera. Their head turns slightly to one
side, as if listening to something off to their right. Unhurried, capable,
entirely self-possessed. The camera follows behind at matched walking speed.

SUBJECT DETAIL: Simple dark clothing. Short dark hair. Wearing slim
matte-black glasses, visible only as a thin dark line at the temple. Never
show the face.

CAMERA: 50mm, T2, shallow depth of field, smooth gimbal follow from behind at
shoulder height, constant distance.

LIGHTING: A single warm amber rim light from the front right, catching the
edge of the cheekbone, the shoulder line, and the temple of the glasses. The
body reads mostly as silhouette. No fill light at all.

BACKGROUND: Completely empty. The background is severely underexposed and
falls off entirely to solid black — no street, no buildings, no road, no
people, no light sources behind them.
```

### Scene 4 · Contact — `arges-contact.mp4`

```
Extreme macro of two fingertips resting lightly against a slim matte-black
band worn on a wrist, in near darkness.

ACTION: The fingers rest still. A soft warm amber glow pulses once slowly
from beneath the surface of the band, blooming and fading — as if the band is
quietly confirming something. The fingers do not move. The camera holds
almost still, breathing very slightly.

SUBJECT DETAIL: Skin texture and fine hairs visible in raking light. Matte
fabric weave on the band. No screen, no display, no digits, no watch face —
the glow comes from beneath a solid surface.

CAMERA: 100mm macro, T2.8, extremely shallow depth of field, locked off,
almost static.

LIGHTING: One warm amber light raking across from the left at a low angle,
picking out texture. The glow from the band is the second, softer source.

BACKGROUND: Pure black empty void. No arm beyond the wrist, no clothing, no
table, no surroundings. Just the wrist, the band, the fingertips, and
blackness.
```

### Scene 5 · The Forge — `arges-network.mp4`

Text sits over this one, so the centre of frame must stay dark.

```
Extreme macro of molten amber light glowing deep inside dark forged metal,
in complete darkness.

ACTION: The camera drifts slowly and steadily to the right across a rough
dark metal surface. Amber heat glows from within seams and fissures in the
metal, brightening and dimming slowly as if breathing. A few slow embers
lift and drift upward through the frame at the left and right edges. Nothing
sudden, nothing flares.

COMPOSITION: The glowing seams run along the lower third and the outer left
and right edges of the frame. The centre of the frame stays dark, uncluttered
and almost empty, so text can be overlaid on it. No bright element ever
crosses the middle of the frame.

CAMERA: 85mm macro, T1.4, very shallow depth of field, slow steady lateral
dolly at constant speed, locked off vertically.

LIGHTING: The molten amber glow within the metal is the only light source.

BACKGROUND: Pure black empty void. No forge, no anvil, no tools, no workshop,
no hands, no fire, no sparks flying, no walls, no floor.
```

Additional negative for scene 5 — ask for a forge and the model reaches for open
flame, which flickers fast and strobes behind the headline. You want heat inside
metal, not fire:

```
fire, flames, open flame, sparks flying, blacksmith, anvil, hammer, hands,
workshop, furnace, forge structure, orange flicker, strobing, bright flash,
lava, volcano, glowing centre of frame
```

---

## Appendix B · File map

```
frontend/src/
  obsidian.css                  the design system — tokens, components, a11y
  index.css                     imports obsidian.css, two Tailwind helpers
  animations/obsidian.ts        the five motion primitives
  lib/media.ts                  the five video slot paths
  lib/api.ts                    the only place that talks to the backend
  hooks/useApiData.ts           loading / error / refetch for every panel
  components/
    Primitives.tsx              Reveal, Rule, SectionHead, CharCascade, Logo
    SiteChrome.tsx              marketing nav + footer
    DashShell.tsx               dashboard chrome, Stat, Panel, DataState
    XRayTeardown.tsx            the teardown — real BOM from the blueprint
    ScrubVideo.tsx              scroll-driven video (scene 1)
    AmbientVideo.tsx            looping video (scenes 2–5)
    Cursor.tsx                  dot + ring overlay
    GlassesViewer3D.tsx         the GLB hero model
    ChangePasswordCard.tsx      used by all four dashboards
  pages/                        Landing · HowItWorks3D · Login · Signup · 4 dashboards
frontend/public/media/          ← the videos go here (README.md included)
docs/superpowers/specs/         the approved design spec
```
