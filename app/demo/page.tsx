import { loadContent } from "@/lib/content/load";
import { langSchema } from "@/lib/content/schema";
import { Invitation } from "@/components/invitation/Invitation";

// The page is personalised per request from `?to=` and `?lang=`, so it can't be
// prerendered into a static shell; let it render on the server for every request.
export const instant = false;

type DemoPageProps = {
  searchParams: Promise<{ to?: string; lang?: string }>;
};

export default async function DemoPage({ searchParams }: DemoPageProps) {
  const content = await loadContent("demo");
  const params = await searchParams;

  const langResult = langSchema.safeParse(params.lang);
  const lang = langResult.success ? langResult.data : content.defaultLanguage;

  const guestLine = params.to?.trim().slice(0, 80) || undefined;

  return <Invitation content={content} lang={lang} guestLine={guestLine} />;
}
