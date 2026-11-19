import type { Metadata } from "next";
import { loadContent } from "@/lib/content/load";
import type { Section } from "@/lib/content/schema";
import { t } from "@/lib/i18n";
import { Invitation } from "@/components/invitation/Invitation";

type CoverSection = Extract<Section, { type: "cover" }>;

// The page is personalised per request from `?to=`, so it can't be
// prerendered into a static shell; let it render on the server for every request.
export const instant = false;

// Per-wedding metadata, read from content/*.json rather than hardcoded, so
// a second wedding (new JSON + media, per docs/PROJECT.md) gets its own
// title/preview image with no code changes. The root layout's metadata is
// only a generic fallback for routes that don't override it.
export async function generateMetadata(): Promise<Metadata> {
  const content = await loadContent("demo");
  const { couple, design, defaultLanguage, sections } = content;
  const cover = sections.find(
    (section): section is CoverSection => section.type === "cover",
  );

  const title = `${couple.partner1} & ${couple.partner2}`;
  const description = cover
    ? t(cover.subtitle, defaultLanguage, defaultLanguage)
    : undefined;
  const image = `/media/${design}/last-frame.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: "website",
    },
  };
}

type DemoPageProps = {
  searchParams: Promise<{ to?: string }>;
};

// Language switching is disabled for now - content.languages is ["ro"], and
// the page always renders in content.defaultLanguage regardless of the URL.
// See docs/DECISIONS.md.
export default async function DemoPage({ searchParams }: DemoPageProps) {
  const content = await loadContent("demo");
  const params = await searchParams;

  const guestLine = params.to?.trim().slice(0, 80) || undefined;

  return (
    <Invitation
      content={content}
      lang={content.defaultLanguage}
      guestLine={guestLine}
    />
  );
}
