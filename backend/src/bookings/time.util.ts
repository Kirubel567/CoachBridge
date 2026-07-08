export const SESSION_MINUTES = 60; // fixed session length for v1
export const SLOT_HORIZON_DAYS = 14; // how far ahead availability is shown

/** "09:30" -> 570 minutes from midnight. Returns NaN if malformed. */
export function hhmmToMinutes(hhmm: string): number {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!m) return NaN;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return NaN;
  return h * 60 + min;
}

/** 570 -> "09:30". */
export function minutesToHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** A UTC Date for `date`'s calendar day at `minute` past midnight UTC. */
export function atMinuteUTC(date: Date, minute: number): Date {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0),
  );
  d.setUTCMinutes(minute);
  return d;
}
