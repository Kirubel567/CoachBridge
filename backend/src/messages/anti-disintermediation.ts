// Flags attempts to move contact off-platform (SRS inverse requirement).
// The message is still delivered but marked `flagged` for admin moderation.

const PATTERNS: Array<{ re: RegExp; reason: string }> = [
  // 8+ digits, possibly spaced/dashed → phone number (e.g. 0911 22 33 44)
  { re: /\d(?:[\s.-]?\d){7,}/, reason: 'phone number' },
  // email address
  { re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, reason: 'email address' },
  // external messaging / social platforms
  {
    re: /\b(telegram|whats\s?app|viber|instagram|insta|facebook|messenger|snapchat|t\.me|wa\.me)\b/i,
    reason: 'external platform',
  },
  // explicit off-platform contact asks
  { re: /\b(call|text|dm|whatsapp|reach)\s+me\b/i, reason: 'off-platform contact' },
];

export function screenMessage(body: string): { flagged: boolean; reason?: string } {
  for (const p of PATTERNS) {
    if (p.re.test(body)) return { flagged: true, reason: p.reason };
  }
  return { flagged: false };
}
