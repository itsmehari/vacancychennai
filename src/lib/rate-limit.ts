type KeyEntry = {
  count: number;
  blockedUntil: number;
};

const attempts = new Map<string, KeyEntry>();

export function getRateLimitState(key: string) {
  const entry = attempts.get(key);
  if (!entry) {
    return { blocked: false, remainingMs: 0 };
  }
  const now = Date.now();
  if (entry.blockedUntil > now) {
    return { blocked: true, remainingMs: entry.blockedUntil - now };
  }
  return { blocked: false, remainingMs: 0 };
}

export function registerFailedAttempt(
  key: string,
  opts = { maxAttempts: 6, blockMs: 15 * 60 * 1000 },
) {
  const current = attempts.get(key) ?? { count: 0, blockedUntil: 0 };
  const nextCount = current.count + 1;
  if (nextCount >= opts.maxAttempts) {
    attempts.set(key, {
      count: nextCount,
      blockedUntil: Date.now() + opts.blockMs,
    });
    return;
  }
  attempts.set(key, { count: nextCount, blockedUntil: 0 });
}

export function clearFailedAttempts(key: string) {
  attempts.delete(key);
}

