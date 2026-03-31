const timestamps = new Map<string, number[]>();

/** Sliding window: max submissions per rolling window (abuse mitigation, PRD §2.5). */
export function allowProfileSubmit(actorKey: string, maxPerWindow: number, windowMs: number) {
  const now = Date.now();
  const list = (timestamps.get(actorKey) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= maxPerWindow) {
    return false;
  }
  list.push(now);
  timestamps.set(actorKey, list);
  return true;
}
