import { randomBytes, createHash } from 'crypto';

/** High-entropy URL-safe token (used for refresh & single-use auth tokens). */
export function randomToken(bytes = 48): string {
  return randomBytes(bytes).toString('base64url');
}

/** Deterministic hash for DB lookup of opaque tokens (safe for random tokens). */
export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/** Parse simple durations like "15m", "30d", "1h", "45s" into milliseconds. */
export function durationToMs(d: string): number {
  const m = /^(\d+)\s*([smhd])$/.exec(d.trim());
  if (!m) return 0;
  const n = Number(m[1]);
  const unit = m[2];
  const mult =
    unit === 's' ? 1000 : unit === 'm' ? 60_000 : unit === 'h' ? 3_600_000 : 86_400_000;
  return n * mult;
}
