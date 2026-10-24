import type { Lang, Localized } from "./content/schema";

export function t(text: Localized, lang: Lang, defaultLanguage: Lang): string {
  return text[lang] ?? text[defaultLanguage] ?? Object.values(text)[0] ?? "";
}

// Generic interface chrome, not wedding copy, so it lives here rather than in content/*.json.
type UiStrings = {
  skip: string;
  mute: string;
  unmute: string;
  scroll: string;
  loading: string;
};

export const uiStrings: Record<Lang, UiStrings> = {
  ro: {
    skip: "Sari peste",
    mute: "Oprește muzica",
    unmute: "Pornește muzica",
    scroll: "Derulează",
    loading: "Se încarcă…",
  },
  ru: {
    skip: "Пропустить",
    mute: "Выключить музыку",
    unmute: "Включить музыку",
    scroll: "Прокрутите",
    loading: "Загрузка…",
  },
  en: {
    skip: "Skip",
    mute: "Mute music",
    unmute: "Unmute music",
    scroll: "Scroll",
    loading: "Loading…",
  },
};
