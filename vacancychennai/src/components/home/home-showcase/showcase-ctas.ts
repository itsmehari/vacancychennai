/** Homepage platform-preview bento — consistent CTA targets */
export const SHOWCASE_HREF = {
  applyJob: (jobId: string) => `/jobs/${jobId}` as const,
  postRole: "/post-job",
  employerLogin: "/employer/login",
  candidateLogin: "/candidate/login",
} as const;
