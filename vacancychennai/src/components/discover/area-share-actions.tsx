"use client";

import {
  areaGroupPost,
  collegeAsk,
  mailtoShareHref,
  telegramShareHref,
  whatsappShareHref,
} from "@/lib/discover/area-share";
import { btnSecondary } from "@/lib/ui";
import { useState } from "react";

type Props = {
  area: string;
  pageUrl: string;
};

export function AreaShareActions({ area, pageUrl }: Props) {
  const post = areaGroupPost(area, pageUrl);
  const ask = collegeAsk(area, pageUrl);
  const [copied, setCopied] = useState<"post" | "email" | null>(null);

  function copy(kind: "post" | "email", text: string) {
    void navigator.clipboard.writeText(text).then(
      () => {
        setCopied(kind);
        window.setTimeout(() => setCopied(null), 2000);
      },
      () => setCopied(null),
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a
        className={btnSecondary}
        href={whatsappShareHref(post)}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>
      <a
        className={btnSecondary}
        href={telegramShareHref(pageUrl, post)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Telegram
      </a>
      <button type="button" className={btnSecondary} onClick={() => copy("post", post)}>
        {copied === "post" ? "Post copied" : "Copy group post"}
      </button>
      <a className={btnSecondary} href={mailtoShareHref(ask.subject, ask.body)}>
        Email a college
      </a>
      <button
        type="button"
        className={btnSecondary}
        onClick={() => copy("email", `${ask.subject}\n\n${ask.body}`)}
      >
        {copied === "email" ? "Email copied" : "Copy college email"}
      </button>
    </div>
  );
}
