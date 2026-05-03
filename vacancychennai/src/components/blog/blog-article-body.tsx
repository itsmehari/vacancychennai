import type { ComponentPropsWithoutRef } from "react";
import type { BlogPost, BlogSection } from "@/lib/blog-posts";
import { BlogRelatedHubLinks } from "@/components/blog/blog-related-hub-links";
import { OmrHiringPlaybookWidgets } from "@/components/blog/omr-hiring-playbook-widgets";
import { hostnameIsResumeDoctor } from "@/lib/partner-resumedoctor";
import { sectionCard } from "@/lib/ui";
import Link from "next/link";

type Props = { post: BlogPost };

type PostWithSections = BlogPost & { sections: BlogSection[] };

function resumedoctorTrackedAnchorProps(href: string): ComponentPropsWithoutRef<"a"> {
  const base: ComponentPropsWithoutRef<"a"> = {
    href,
    rel: "noopener noreferrer",
    target: "_blank",
    className: "font-semibold text-blue-700 hover:text-blue-900 hover:underline",
  };
  try {
    const url = new URL(href);
    if (!hostnameIsResumeDoctor(url.hostname)) return base;
    const uc = url.searchParams.get("utm_content")?.trim();
    return {
      ...base,
      "data-partner-link": "resume-doctor",
      ...(uc ? { "data-utm-content": uc } : {}),
    } as ComponentPropsWithoutRef<"a">;
  } catch {
    return base;
  }
}
export function BlogArticleBody({ post }: Props) {
  const sections = post.sections;
  if (sections && sections.length > 0) {
    return <SectionedArticle post={{ ...post, sections }} />;
  }

  return (
    <>
      <div className={`${sectionCard} space-y-4`}>
        {post.paragraphs.map((p, i) => (
          <p key={i} className="leading-relaxed text-slate-800">
            {p}
          </p>
        ))}
      </div>
      {post.relatedHubLinks?.length ? <BlogRelatedHubLinks links={post.relatedHubLinks} /> : null}
    </>
  );
}

function SectionedArticle({ post }: { post: PostWithSections }) {
  const { sections } = post;

  return (
    <>
      <nav
        aria-label="On this page"
        className={`${sectionCard} mb-8 border-blue-100 bg-slate-50/80 p-5`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-800">On this page</p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {sections.map((s, i) => (
            <li key={s.id} className="text-sm">
              <a href={`#${s.id}`} className="font-medium text-blue-700 hover:text-blue-900 hover:underline">
                <span className="text-slate-400 tabular-nums">{i + 1}.</span> {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-12">
        {sections.map((section) => (
          <div key={section.id}>
            <section
              id={section.id}
              className={`${sectionCard} scroll-mt-24 space-y-4`}
              aria-labelledby={`heading-${section.id}`}
            >
              <h2 id={`heading-${section.id}`} className="text-xl font-semibold tracking-tight text-slate-900">
                {section.heading}
              </h2>

              {section.table ? (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full min-w-[280px] text-left text-sm">
                    <caption className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-left text-xs font-semibold text-slate-700">
                      {section.table.caption}
                    </caption>
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80">
                        {section.table.columns.map((col) => (
                          <th key={col} scope="col" className="px-4 py-2 font-semibold text-slate-800">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, ri) => (
                        <tr key={ri} className="border-b border-slate-100 last:border-0">
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-4 py-2 align-top text-slate-700">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {section.paragraphs?.map((p, i) => (
                <p key={i} className="leading-relaxed text-slate-800">
                  {p}
                </p>
              ))}

              {section.bullets?.length ? (
                <ul className="list-inside list-disc space-y-2 text-slate-800 marker:text-blue-600">
                  {section.bullets.map((b, i) => (
                    <li key={i} className="leading-relaxed ps-1">
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.callout ? (
                <aside
                  className="rounded-lg border border-amber-200/90 bg-amber-50/60 px-4 py-3 text-sm text-slate-800"
                  aria-label="Related resource"
                >
                  <p className="font-semibold text-amber-950">{section.callout.title}</p>
                  <p className="mt-2 leading-relaxed">{section.callout.body}</p>
                  {section.callout.href ? (
                    <p className="mt-2">
                      {/^https?:\/\//i.test(section.callout.href) ? (
                        <a {...resumedoctorTrackedAnchorProps(section.callout.href)}>
                          {section.callout.linkLabel ?? section.callout.href}
                        </a>
                      ) : (
                        <Link href={section.callout.href} className="font-semibold text-blue-700 hover:text-blue-900 hover:underline">
                          {section.callout.linkLabel ?? section.callout.href}
                        </Link>
                      )}
                    </p>
                  ) : null}
                </aside>
              ) : null}

              {section.faq?.length ? (
                <div className="space-y-2">
                  {section.faq.map((item, i) => (
                    <details
                      key={i}
                      className="group rounded-lg border border-slate-200 bg-white px-4 py-1 open:pb-3 open:shadow-sm"
                    >
                      <summary className="cursor-pointer list-none py-3 font-medium text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                        <span className="inline-flex w-full items-center justify-between gap-2">
                          {item.question}
                          <span
                            className="text-slate-400 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                            aria-hidden
                          >
                            ▼
                          </span>
                        </span>
                      </summary>
                      <p className="border-t border-slate-100 pt-2 text-sm leading-relaxed text-slate-700">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              ) : null}
            </section>

            {post.interactive === "omr-hiring-playbook" && section.id === "how-candidates-search" ? (
              <div className="mt-8">
                <OmrHiringPlaybookWidgets />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {post.relatedHubLinks?.length ? <BlogRelatedHubLinks links={post.relatedHubLinks} /> : null}
    </>
  );
}
