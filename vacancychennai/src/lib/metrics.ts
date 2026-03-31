type MetricCounters = Record<string, number>;

const counters: MetricCounters = {
  authSuccess: 0,
  authFailure: 0,
  applySuccess: 0,
  applyFailure: 0,
  moderationUpdates: 0,
  candidateProfileUpdate: 0,
};

export function incrementMetric(
  metric: keyof typeof counters,
  value = 1,
): void {
  counters[metric] += value;
}

export function getMetricsSnapshot() {
  return {
    ...counters,
    generatedAt: new Date().toISOString(),
  };
}

