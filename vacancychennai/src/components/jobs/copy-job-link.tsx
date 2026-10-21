"use client";

import { btnSecondary } from "@/lib/ui";
import { useState } from "react";

export function CopyJobLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={btnSecondary}
      onClick={() => {
        void navigator.clipboard.writeText(url).then(
          () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          },
          () => setCopied(false),
        );
      }}
    >
      {copied ? "Link copied" : "Copy job link"}
    </button>
  );
}
