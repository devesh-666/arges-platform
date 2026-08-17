# Video slots

Drop a file here with the exact name below and the matching section picks it
up on next load. No code change, no rebuild config — the paths are declared in
`src/lib/media.ts`.

Every slot is optional. With none of these present the site is complete: each
section falls back to a poster or a painted ambient wash. They are enhancements,
not dependencies.

| File | Sec | Where it appears |
|---|---|---|
| `arges-hero.mp4` | 8 | `/3d` Act I — scroll-scrubbed. Must end pushing into the temple arm, so Act II's match cut lands. |
| `arges-signal.mp4` | 8 | `/3d`, between the teardown and the pipeline. Abstract light in a channel. |
| `arges-morning.mp4` | 8 | Landing, under the hero. Someone walking, shot from behind. |
| `arges-contact.mp4` | 6 | Landing, inside the teardown teaser. Haptic macro on the wrist. |
| `arges-network.mp4` | 8 | Landing, behind the closing CTA. City at dusk. |

## Encoding

`arges-hero.mp4` is **seeked continuously** by scroll position. A normal export
places keyframes about two seconds apart, so every seek decodes a whole chunk
and the scrub stutters badly on mobile. Re-encode it with dense keyframes:

```bash
ffmpeg -i export.mp4 -an -g 6 -c:v libx264 -crf 23 -movflags +faststart arges-hero.mp4
```

The other four only loop and are never seeked, so a normal export is fine —
though `-an` is still worth applying since all five play muted:

```bash
ffmpeg -i export.mp4 -an -c:v libx264 -crf 23 -movflags +faststart arges-signal.mp4
```

Aim for under ~8MB each. These ship from the CDN on first paint of their
section.

## Grade

All five are graded near-black with a single amber accent (`#FF6B1A`) and no
other colour, matching the Obsidian palette. A clip that arrives blue or
high-key will fight every surface around it.
