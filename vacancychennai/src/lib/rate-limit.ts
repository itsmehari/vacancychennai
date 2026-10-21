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

const windows = new Map<string, number[]>();

/** Returns true when this hit is still inside the window limit. */
export function consumeRateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const start = now - windowMs;
  const stamps = (windows.get(key) ?? []).filter((stamp) => stamp > start);
  if (stamps.length >= max) {
    windows.set(key, stamps);
    return false;
  }
  stamps.push(now);
  windows.set(key, stamps);
  return true;
}

const verificationEmailSends = new Map<string, number[]>();

export function canSendVerificationEmail(
  key: string,
  maxSends = 5,
  windowMs = 60 * 60 * 1000,
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const stamps = (verificationEmailSends.get(key) ?? []).filter(
    (t) => t > windowStart,
  );
  return stamps.length < maxSends;
}

export function recordVerificationEmailSent(
  key: string,
  windowMs = 60 * 60 * 1000,
) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const stamps = (verificationEmailSends.get(key) ?? []).filter(
    (t) => t > windowStart,
  );
  stamps.push(now);
  verificationEmailSends.set(key, stamps);
}

