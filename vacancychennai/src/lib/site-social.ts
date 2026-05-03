import type { FooterSocialLink } from "@/lib/footer-config";

function trimEnv(key: keyof NodeJS.ProcessEnv): string {
  const v = process.env[key];
  return typeof v === "string" ? v.trim() : "";
}

/** Footer icons — URLs from env so production can update without touching copy. */
export function resolvedFooterSocialLinks(): FooterSocialLink[] {
  return [
    {
      id: "linkedin",
      href: trimEnv("NEXT_PUBLIC_SOCIAL_LINKEDIN_URL"),
      label: "Vacancy Chennai on LinkedIn",
    },
    {
      id: "twitter",
      href: trimEnv("NEXT_PUBLIC_SOCIAL_TWITTER_URL"),
      label: "Vacancy Chennai on X",
    },
    {
      id: "facebook",
      href: trimEnv("NEXT_PUBLIC_SOCIAL_FACEBOOK_URL"),
      label: "Vacancy Chennai on Facebook",
    },
  ];
}

/** Schema.org Organization `sameAs` — non-empty public profile URLs only. */
export function organizationSameAsUrls(): string[] {
  const out: string[] = [];
  const extra = trimEnv("NEXT_PUBLIC_ORG_SAME_AS");
  if (extra) {
    for (const part of extra.split(/[\s,]+/)) {
      const u = part.trim();
      if (u.startsWith("http://") || u.startsWith("https://")) out.push(u);
    }
  }
  for (const u of resolvedFooterSocialLinks()) {
    if (u.href) out.push(u.href);
  }
  return [...new Set(out)];
}
