export const MASCOT_TIMING = Object.freeze({
  readingWpm: 150,
  normalMinMs: 3000,
  clickMinMs: 5200,
  initialMinMs: 5000,
  idleSleepMs: 90_000,
  wakeDelayMs: 3_000,
  speakerGapMs: 320,
});

export function readingDuration(
  text,
  {
    min = MASCOT_TIMING.normalMinMs,
    max = 12_000,
    wpm = MASCOT_TIMING.readingWpm,
    extra = 650,
  } = {},
) {
  const clean = String(text ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = clean ? clean.split(' ').length : 1;
  const commas = (clean.match(/[,;]/g) || []).length;
  const stops = (clean.match(/[.!?]/g) || []).length;
  const pauses = (clean.match(/[—:…]/g) || []).length;
  const punctuationBonus = commas * 110 + stops * 190 + pauses * 150;
  const base = (words / wpm) * 60_000;

  return Math.max(min, Math.min(max, Math.round(base + extra + punctuationBonus)));
}
