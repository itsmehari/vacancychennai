import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/site-base-url";
import { buildLlmsTxtMarkdown } from "@/lib/llm-site-index";

export const revalidate = 3600;

export async function GET() {
  const body = await buildLlmsTxtMarkdown();
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      Link: `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    },
  });
}
