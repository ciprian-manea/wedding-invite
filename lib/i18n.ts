import type { Lang, Localized } from "./content/schema";

export function t(text: Localized, lang: Lang, defaultLanguage: Lang): string {
  return text[lang] ?? text[defaultLanguage] ?? Object.values(text)[0] ?? "";
}
