# Building UI that doesn't look generated

A working method for producing distinctive, premium interfaces. Written for
another model to pick up and use. Every rule here has a reason attached, because
rules without reasons get misapplied.

The examples come from ARGES — a dark, single-accent product site — but the
method is not tied to that look.

---

## Part I · Why most generated UI looks the same

Before technique, diagnosis. Generated interfaces converge on an identifiable
house style, and it is worth naming precisely because you have to actively
steer away from it.

The tells:

| Tell | What it looks like |
|---|---|
| Radius on everything | `rounded-lg` on cards, buttons, inputs, images, avatars alike |
| Multi-accent palettes | blue primary, purple secondary, green success, each used decoratively |
| Weight for hierarchy | `font-bold` headings, `font-semibold` subheadings, `font-medium` labels |
| Shadow for depth | `shadow-md` on every card, `shadow-lg` on hover |
| Uniform spacing | the same gap between everything, no rhythm |
| Default tracking | system font stack at `letter-spacing: normal` at every size |
| The 3-up feature grid | icon, bold heading, two lines of grey body, three times across |
| Centered everything | every section centered, nothing ever pinned or offset |
| Gradient text | `bg-clip-text` on the hero headline |

None of these are *wrong*. They are **defaults**, and defaults read as
defaults. An interface looks designed when a human can point at a decision and
say "someone chose that."

**The core principle: one decision, carried ruthlessly.**

Distinctive design is usually not more ideas. It is fewer ideas applied without
exception. A single accent colour used only for action. A single font weight
across every heading. A single elevation method. The discipline is what reads as
intent — because inconsistency is what reads as accident.

When you are asked to make something "premium," "high-end," or "not templated,"
the move is almost always **subtraction**, not addition.

---

## Part II · Choosing a direction before writing CSS

Do not start with tokens. Start with a reference and a constraint.

### 1. Find a real reference

Not "make it look premium" — decide *which* premium. These are genuinely
different visual languages:

- **Austere luxury** (Bugatti, Bang & Olufsen): near-black, no accent colour at
  all, wide-tracked uppercase, photography carries everything.
- **Engineered-cosmic** (x.ai, SpaceX): near-black, one warm accent, monospace
  labels, weight-400 display type, pill interactives.
- **Theatrical luxury** (Lamborghini, Ferrari): true black, one saturated
  accent, 120px uppercase headlines, zero radius, full-viewport video.
- **Software craft** (Linear, Vercel): deepest dark, dense panels, hairline
  borders, technical density as the aesthetic.
- **Editorial** (Stripe, Notion): light canvas, serif/sans mix, generous
  measure, illustration over photography.
- **Radical subtraction** (Apple, Tesla): light canvas, one accent, enormous
  white space, product photography as the only voltage.

Pick one. Say which one you picked and why. A direction you can name is a
direction you can apply consistently.

### 2. Find the constraint that makes it non-generic

The best design decisions come from a real constraint in the project:

- ARGES's brand orange `#FF6B1A` was nearly identical to x.ai's `accent-sunset`
  `#ff7a17`. That coincidence chose the direction — it let the site go premium
  *while restoring* the brand colour instead of replacing it.
- The product is for blind users' families, which killed the theatrical option:
  120px uppercase shouting fights an accessibility product.
- The hardware blueprint existed, so the "inside the device" section could be
  drawn from a real bill of materials rather than invented — which is why it
  carries weight.

**Look for these before designing.** Existing brand assets, real technical
constraints, actual content, the audience. Generic design is what happens when
you design for no one in particular.

### 3. Name the reversals

If you are redesigning, state explicitly what you are *undoing* and why, so
someone later does not "fix" it back:

> Glassmorphism is retired as the system default. Per-role accent colours are
> dropped — a single-voltage system cannot carry four hues.

Undocumented deliberate choices get reverted by the next person.

---

## Part III · The systems

### Tokens

Define once, in one file, at the top. Every value in the interface comes from
here. If you are writing a hex code anywhere else, you have made a mistake.

```css
:root {
  /* Surface — a ladder, not a pair */
  --canvas:      #08080C;
  --canvas-soft: #101015;
  --canvas-card: #131318;
  --hairline:    #212327;
  --hairline-hi: #2E3036;

  /* Ink — four levels is enough, and you must use all four */
  --ink:   #FFFFFF;   /* primary text */
  --body:  #DADBDF;   /* secondary */
  --mute:  #7D8187;   /* captions, labels */
  --faint: #4E5157;   /* disabled, dimension marks */

  /* The single voltage */
  --accent: #FF6B1A;

  /* State — never decorative */
  --ok: #27A644;  --warn: #F9A825;  --danger: #E5484D;
}
```

Two things that matter more than the values:

**A surface ladder, not a binary.** Novice systems have "background" and "card."
Real ones have four or five steps so nesting stays legible. `--canvas` →
`--canvas-soft` → `--canvas-card` → `--canvas-mid`.

**Four ink levels, all used.** Generated UI typically uses two (white and grey)
and the result reads flat. The discipline: primary text, secondary body, muted
labels, faint marks. Assign each a job and stick to it.

### Typography — the highest-leverage system

Most of the difference between amateur and professional UI is here.

**Rule 1 — hierarchy from scale and tracking, not weight.**

The generated default is `bold` for headings. The premium move is a single
weight (usually 400 or 500) with size and letter-spacing doing the work:

```css
.display-xl { font-size: clamp(2.75rem, 7.5vw, 6rem);  letter-spacing: -0.04em; font-weight: 400; }
.display-lg { font-size: clamp(2.25rem, 5.5vw, 4.5rem); letter-spacing: -0.035em; font-weight: 400; }
.display-md { font-size: clamp(1.75rem, 3.6vw, 3rem);   letter-spacing: -0.03em;  font-weight: 400; }
.display-sm { font-size: clamp(1.35rem, 2.2vw, 2rem);   letter-spacing: -0.02em;  font-weight: 400; }
```

**Rule 2 — negative tracking scales with size.** This is the part most people
miss. Large type needs tighter tracking; small type needs looser. A fixed
`letter-spacing: -0.02em` across the scale looks wrong at both ends. The
*relationship* is the signature — flatten it and the type reads generic even
with the right font.

Rough guide:

| Size | Tracking |
|---|---|
| 96px+ | `-0.04em` |
| 48–72px | `-0.03em` |
| 24–32px | `-0.02em` |
| 16–18px (body) | `0` |
| 11–13px (labels, uppercase) | `+0.1em` to `+0.24em` |

Note the flip: **uppercase small text needs positive tracking.** Uppercase at
11px with normal tracking is unreadable and looks cheap.

**Rule 3 — a second face, used narrowly.** One display/body face plus one
monospace, where the mono does labels only. This single pairing produces most
of the "technical premium" feel:

```css
.eyebrow {
  font-family: var(--mono);
  font-size: 0.6875rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--accent);
}
```

Used above every section heading, it becomes a **signature move** — a repeated
element the eye learns. Signature moves are how an interface acquires identity.
Pick one and repeat it everywhere.

**Rule 4 — line-height inverse to size.** Display type at `0.95–1.05`. Body at
`1.5–1.65`. Generated UI uses `1.5` everywhere, which makes headlines look
loose and unresolved.

**Rule 5 — measure.** Constrain text width with `ch`, not `px`: headings
`max-width: 18ch`, body `max-width: 52ch` to `68ch`. Full-width paragraphs are
one of the fastest tells of unconsidered layout.

### Colour discipline

**One accent.** It marks action and state. Never decoration, never "to add
visual interest." If you find yourself adding a second accent because a section
looks plain, the section has a layout problem, not a colour problem.

**Semantic colour is separate and must stay narrow** — success, warning, danger,
and only on things that have those states. A green icon because "it looks nice"
destroys the meaning of green everywhere else in the product.

**Colour must never be the only signal.** Every status indicator pairs its
colour with text or a shape. This is an accessibility requirement and also just
better design — it survives greyscale, colourblindness, and small sizes.

**Test:** screenshot the interface, desaturate it. If the hierarchy still reads,
the design is sound. If it collapses, you were leaning on colour to do
structural work.

### Space and rhythm

Use a 4px base and a named ladder:

```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128
```

**Rhythm means unequal spacing used deliberately.** The gap between a heading
and its body should be smaller than the gap between one section and the next.
Generated layouts use the same gap everywhere, which is why they read as flat
lists rather than as composed pages.

A reliable pattern:

```
eyebrow      → heading      : 12–16px   (tight — they belong together)
heading      → body         : 16–24px
body         → CTA          : 32–48px
section      → next section : 96–128px  (large — separation is the point)
```

### Depth and elevation

Pick **one** method and use it exclusively:

| Method | Reads as | Use when |
|---|---|---|
| Hairline borders | precise, engineered, modern | dark UI, technical products, most premium work |
| Shadows | soft, physical, friendly | light UI, consumer apps, playful brands |
| Layered surfaces | dense, professional | data-heavy tools |
| Frosted glass | dated (2020–2021) | rarely — it now reads as a period style |

Mixing them is what makes an interface look assembled rather than designed. If
you use hairlines, use them everywhere — the temptation to "just add a subtle
shadow here" is exactly the drift to resist.

```css
.card {
  background: var(--canvas-card);
  border: 1px solid var(--hairline);
  border-radius: 8px;
  /* no shadow. ever. */
}
```

### Shape

Assign radius by role, not by taste:

```
0px    full-bleed bands, page-width sections
8px    cards, inputs, containers
9999px every interactive element — buttons, tags, pills
```

Making *every* interactive a pill and *every* container 8px is a rule that
instantly separates a designed system from `rounded-lg` applied uniformly. The
consistency is the point.

---

## Part IV · Motion

Motion is where most interfaces are weakest, because it is usually added
per-component instead of designed as a system.

### Design primitives, not animations

Define four or five motion primitives and compose everything from them. This
keeps an interface feeling coherent no matter how many sections it grows.

```ts
export const EASE = [0.16, 1, 0.3, 1] as const;   // expo-out. one curve.

export const T = {
  micro:     0.18,   // hover, press — must stay fast
  element:   0.55,   // entrances
  section:   0.9,    // large reveals
  cinematic: 1.4,    // hero moments
};
```

**One curve for the whole product.** Expo-out (`0.16, 1, 0.3, 1`) is a strong
default: fast start, long settle, reads as expensive. Mixing curves is another
"assembled not designed" tell.

**Duration is a genre signal.** Under ~300ms reads as a UI transition. Past
~550ms it reads as cinematography. Marketing surfaces want the latter;
interactive feedback must stay under 200ms or the product feels laggy. Choose
per-context, not globally.

The primitives themselves:

```ts
rise          // y+24 → 0 + fade. the default entrance for everything.
maskWipe      // clip-path reveal. type appears printed rather than faded.
charCascade   // per-character. expensive to read — once per page, hero only.
hairlineDraw  // scaleX 0 → 1. dividers draw themselves.
accentIgnite  // accent enters 200ms AFTER its content.
```

That last one is worth internalising. **Delaying the accent makes colour read as
voltage rather than decoration.** The eye registers the content, then the
highlight arrives — which is the difference between "this is important" and
"this is coloured."

### Stagger

`0.06–0.09s` between children. Below that it reads as simultaneous; above ~0.12s
the last item feels late. Cap the total: with 12 items at 0.08s the final one
arrives a second after the first, which is too long. Either reduce the stagger
or split into groups.

### Reveal once

`viewport={{ once: true }}`. Elements re-animating every time they scroll into
view is irritating and cheap. Trigger slightly before fully visible:
`margin: '-12% 0px -12% 0px'`.

### Reduced motion is not optional

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**But flattening transitions is not sufficient** when meaning is carried by
motion. A scroll-driven sequence that reveals content step by step must render a
**static completed state** under reduced motion — otherwise those users get an
empty section. Check every scroll-driven component for this specifically.

---

## Part V · Scroll choreography

The highest-impact and most-often-botched technique.

### Sticky sequences

The basic structure: a tall container with a sticky child. Scroll progress
through the container drives what the sticky child shows.

```tsx
<section ref={ref} style={{ height: '400vh' }}>
  <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
    {/* driven by scrollYProgress */}
  </div>
</section>
```

Height budget: roughly **100vh of scroll per beat**, plus 100vh for the sticky
itself. Four beats ≈ 500vh. Too short and it feels rushed; too long and users
think the page is broken.

### Springs, not eases, on scroll-driven values

This distinction costs real debugging time:

- An **ease curve** applied to a scroll-driven value remaps *position*. The
  element races ahead then crawls relative to your thumb. It feels broken.
- A **spring** is a *filter*. It removes wheel-step jitter while keeping the
  mapping monotonic. It costs a few milliseconds of lag and is what makes a
  sequence feel continuous rather than notched.

```ts
const p = useSpring(scrollYProgress, { stiffness: 140, damping: 34, mass: 0.35 });
```

Never an ease. Always consider a spring.

### The match cut — and why it usually fails

A match cut hands off between two visuals so they read as one continuous move.
It is the single most impressive scroll technique and it fails for one reason
almost every time:

**Two sticky containers in two sections cannot match-cut.** When the first
section's scroll range ends, its sticky child unsticks and scrolls away — so at
the moment of the "cut" the first visual is already gone. There is nothing to
cut *from*. No amount of timing adjustment fixes this; it is structural.

The fix is one shared container:

```tsx
<section ref={ref} style={{ height: '620vh' }}>
  <div style={{ position: 'sticky', top: 0, height: '100vh' }}>

    {/* Layer 1 — persists the whole time, dims and keeps moving */}
    <motion.div style={{ opacity: filmOpacity, scale: filmScale, filter: filmBlur }}>
      <Film />
    </motion.div>

    {/* Layer 2 — arrives over-scaled, matching layer 1's framing, settles */}
    <motion.div style={{ opacity: xrayOpacity, scale: xrayScale }}>
      <Diagram />
    </motion.div>

  </div>
</section>
```

with an overlapping window:

```
0.00 – 0.30   layer 1 plays
0.28 – 0.42   THE CUT — overlap. layer 2 fades in 1.32 → 1.0 scale
              while layer 1 dims to 0.22 and keeps pushing in
0.42 – 1.00   layer 2 owns the sequence, layer 1 remains behind it
```

Three requirements:

1. **Overlap.** The windows must intersect. A gap is a cut, not a match cut.
2. **The outgoing layer persists.** Dim it, blur it, but do not remove it. It
   becomes the ground the new layer sits inside.
3. **Scale continuity.** If layer 1 ends pushed in, layer 2 must *enter*
   over-scaled and settle. This is what sells the illusion — matching framing
   across the transition.

### Scroll-scrubbed video

Driving a video's playhead by scroll. Two non-obvious requirements:

**Coalesce seeks through rAF.** Assigning `currentTime` on every scroll event
queues seeks faster than the decoder retires them, and it stutters badly on
mobile:

```ts
const tick = () => {
  raf.current = 0;
  const next = target.current * video.duration;
  if (Math.abs(video.currentTime - next) > 1 / 30) video.currentTime = next;
};
progress.on('change', v => {
  target.current = v;
  if (!raf.current) raf.current = requestAnimationFrame(tick);
});
```

**Re-encode with dense keyframes.** A normal export places keyframes ~2s apart,
so every seek decodes a whole chunk. This is the single biggest cause of janky
scrub video:

```bash
ffmpeg -i in.mp4 -an -g 6 -c:v libx264 -crf 23 -movflags +faststart out.mp4
```

`-g 6` gives a keyframe every 6 frames. Verify it worked — a 10s clip at 24fps
should report ~40 keyframes, not 3.

### Parallax

Move background elements *further* than foreground, and fade them out faster.
Keep it subtle: 10–20% displacement over a full viewport. More than that induces
motion sickness and looks like a template.

---

## Part VI · Component contracts

### Every data component needs four states

Design all four before building. Missing states are the most common cause of
interfaces that look fine in a mockup and fall apart in production.

```tsx
<DataState loading={loading} error={error} empty={!rows.length}>
  {children}
</DataState>
```

`loading` · `error` · `empty` · `populated`. Build one shared component so all
four are consistent everywhere, rather than each panel inventing its own.

### Degrade without breaking

Any component depending on an external asset must render acceptably when it is
missing. Not a broken image icon, not a gap — an intentional-looking fallback:

```tsx
background: 'radial-gradient(120% 100% at 70% 30%, rgba(255,107,26,0.10), transparent 60%), var(--canvas-soft)'
```

An interface that looks complete before its assets arrive is one you can ship
incrementally. This is a design decision, not just engineering hygiene.

### Slot manifests

When several components consume external assets, declare the paths in one file
so the contract is visible and drop-in:

```ts
export const MEDIA = {
  hero:    '/media/hero.mp4',
  signal:  '/media/signal.mp4',
} as const;
```

---

## Part VII · Accessibility as craft

Treat these as design constraints, not a compliance pass. They make the work
better, not just legal.

**Focus must always be visible.** Never `outline: none` without a replacement:

```css
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
```

**Decorative means `aria-hidden`.** Background video, hero renders, vignettes,
ornamental icons. If it carries no information, hide it from assistive tech.

**Animated text needs a real label.** A per-character reveal produces a stream
of single letters to a screen reader. Expose the whole string and hide the
fragments:

```tsx
<motion.span aria-label={text}>
  {chars.map((c, i) => <motion.span key={i} aria-hidden>{c}</motion.span>)}
</motion.span>
```

**Diagrams need a text equivalent.** An SVG diagram should have a descriptive
`aria-label` *and*, where it carries data, the same information as real text
nearby. In the ARGES teardown, the parts list beside the diagram is both a design
element and the accessible rendering.

**Every page needs a skip link** as the first focusable element.

**Contrast:** 4.5:1 for body text, 3:1 for large text and UI boundaries. On dark
canvases, muted greys fail more often than you expect — check `--mute` against
`--canvas` specifically.

---

## Part VIII · Failure modes and debugging

### The cascade traps

**Unlayered resets outrank layered utilities.** In Tailwind v4, a bare
`* { margin: 0; padding: 0 }` beats every layered utility — silently killing
every padding and margin class in the app. Put it in `@layer base`:

```css
@layer base {
  * { margin: 0; padding: 0; box-sizing: border-box; }
}
```

Custom helper classes go in `@layer components` so utilities on the same element
still win.

**A class with no rule fails silently.** Using `.some-class` in markup with no
CSS behind it produces no error and can wreck layout — an unsized `svg` inside
an undefined class once stretched a page to 6000px. When you write a class name,
confirm it exists.

**Duplicate selectors: the last one wins, silently.** Stylesheets assembled from
multiple sources accumulate `.card` defined ten times. Before concluding
something is "styled oddly," search for every definition of that selector.

### The design review checklist

Before calling an interface done:

1. **Desaturate it.** Does hierarchy survive without colour?
2. **Count the accents.** More than one non-semantic accent? Remove one.
3. **Count font weights.** More than two? Remove one.
4. **Check the spacing rhythm.** Is section separation clearly larger than
   internal separation?
5. **Tab through it.** Is focus visible on every stop, in a sensible order?
6. **Turn on reduced motion.** Is any content now missing or empty?
7. **Resize to 360px.** Does anything overflow horizontally?
8. **Empty every data source.** Does it look intentional or broken?
9. **Read the headlines aloud.** Generic marketing copy undoes good typography.
10. **Point at three decisions and justify each.** If you cannot, it is
    defaults all the way down.

### When asked to "make it smoother"

This almost always means one of:

- **Durations too short** — raise element transitions toward 500–600ms.
- **Scroll motion unfiltered** — add a spring to scroll-driven values.
- **Discrete state changes** — a step that snaps between states needs a
  transition on the properties that change.
- **Missing overlap** — sequential sections that hand off with a gap. Overlap
  the windows.

### When asked to make it "less plain"

Resist adding colour. In order of effectiveness:

1. **Increase type scale contrast.** Make the big things much bigger.
2. **Add a signature repeated element** (the mono eyebrow, a numbered index).
3. **Add texture** — a subtle grain overlay adds richness without chrome:
   ```css
   body::after {
     content: ''; position: fixed; inset: 0; pointer-events: none;
     opacity: 0.16; mix-blend-mode: overlay;
     background-image: url("data:image/svg+xml,...feTurbulence...");
   }
   ```
4. **Add depth through layering** — a dimmed, blurred image behind a diagram
   gives flat vector work something to sit inside.
5. **Increase spacing.** Plain often means cramped, not undecorated.

---

## Part IX · A worked example

The ARGES brief: "premium, rich, heavily animated, should feel exclusive."

**Direction chosen:** engineered-cosmic (x.ai) plus austere restraint
(Bugatti). Rejected theatrical luxury because 120px uppercase shouting fights an
accessibility product for blind users' families.

**The constraint that made it non-generic:** the brand orange `#FF6B1A` was
within a hair of x.ai's `accent-sunset`. The premium direction could *restore*
brand identity rather than replace it.

**The system:**

```
canvas #08080C · one accent #FF6B1A · Inter weight 400 only
negative tracking scaling -0.04em → -0.02em
JetBrains Mono uppercase +0.24em for every section eyebrow
pill interactives · 8px cards · hairline elevation · no shadows
film grain at 16% overlay
```

**Motion:** five primitives, one expo curve, ladder at 180/550/900ms,
spring-smoothed scroll.

**The signature move:** a mono uppercase eyebrow above every section heading,
plus the accent always arriving 200ms after its content.

**The hard part:** a four-act scroll explainer where a video hands off to an SVG
diagram via match cut. Failed on the first attempt because the acts were two
sticky containers — fixed by merging into one, persisting the video dimmed
behind the diagram, and having the diagram enter over-scaled and settle.

**What made it credible:** the technical diagram was drawn from the actual
hardware blueprint — real part numbers, real dimensions, real positions. Not
invented. Specificity is what separates a convincing product page from a
plausible-looking one.

---

## The short version

1. Pick a named direction, not "premium."
2. Find the project's real constraint and design from it.
3. One accent. One font weight. One elevation method. One easing curve.
4. Hierarchy from scale and tracking, not weight.
5. Negative tracking must scale with size.
6. Rhythm means unequal spacing on purpose.
7. Build motion from four or five primitives, not per component.
8. Springs on scroll values, never eases.
9. Match cuts need one container, overlapping windows, and scale continuity.
10. Design all four data states before building.
11. Make it work when the assets are missing.
12. Accessibility is a design constraint, and it improves the work.
13. When it looks plain, subtract and space — do not add colour.
14. Every deliberate reversal must be documented or it will be reverted.
