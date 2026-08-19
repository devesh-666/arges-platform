/**
 * Video slots.
 *
 * Every entry is optional at runtime: if the file is absent the component
 * falls back to a poster or a painted placeholder, so the site is complete
 * with none of these present and improves as each one lands. Drop a file at
 * the given path and it appears — no code change.
 *
 * Scrub-driven clips (`hero`) are seeked constantly by scroll position, so
 * they must be encoded with dense keyframes or the scrub stutters:
 *
 *   ffmpeg -i export.mp4 -an -g 6 -c:v libx264 -crf 23 -movflags +faststart out.mp4
 *
 * Ambient clips loop and are never seeked, so a normal export is fine for
 * those — though `-an` is still worth it since they all play muted.
 */

/**
 * The `?v=2` suffixes are cache-busting. Chrome serves videos from its media
 * cache even across hard refreshes (range requests bypass reload logic), so
 * after replacing the clips on disk the URL must change to force every
 * browser to fetch the new bytes. Bump the version whenever media is
 * replaced in place.
 */
export const MEDIA = {
  /** Scene 1 · 8s · /3d Act I. Scroll-scrubbed; must end pushing into the temple. */
  hero: '/media/arges-hero.mp4?v=2',

  /** Scene 2 · 8s · /3d, between the teardown and the pipeline. Abstract light. */
  signal: '/media/arges-signal.mp4?v=2',

  /** Scene 3 · 8s · Landing, under the hero. The human moment. */
  morning: '/media/arges-morning.mp4?v=2',

  /** Scene 4 · 6s · Landing, inside the teardown teaser. Haptic macro. */
  contact: '/media/arges-contact.mp4?v=2',

  /** Scene 5 · 8s · Landing, behind the closing CTA. City at dusk. */
  network: '/media/arges-network.mp4?v=2',
} as const;
