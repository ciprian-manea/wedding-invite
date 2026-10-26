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
  todayLabel: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  copyLabel: string;
  copiedLabel: string;
  openInMaps: string;
  addToCalendar: string;
  googleCalendarLabel: string;
};

export const uiStrings: Record<Lang, UiStrings> = {
  ro: {
    skip: "Sari peste",
    mute: "Oprește muzica",
    unmute: "Pornește muzica",
    scroll: "Derulează",
    loading: "Se încarcă…",
    todayLabel: "Astăzi este marea zi",
    days: "zile",
    hours: "ore",
    minutes: "minute",
    seconds: "secunde",
    copyLabel: "Copiază",
    copiedLabel: "Copiat!",
    openInMaps: "Deschide în Maps",
    addToCalendar: "Adaugă în calendar",
    googleCalendarLabel: "Google Calendar",
  },
  ru: {
    skip: "Пропустить",
    mute: "Выключить музыку",
    unmute: "Включить музыку",
    scroll: "Прокрутите",
    loading: "Загрузка…",
    todayLabel: "Сегодня важный день",
    days: "дни",
    hours: "часы",
    minutes: "минуты",
    seconds: "секунды",
    copyLabel: "Копировать",
    copiedLabel: "Скопировано!",
    openInMaps: "Открыть на карте",
    addToCalendar: "Добавить в календарь",
    googleCalendarLabel: "Google Calendar",
  },
  en: {
    skip: "Skip",
    mute: "Mute music",
    unmute: "Unmute music",
    scroll: "Scroll",
    loading: "Loading…",
    todayLabel: "Today is the day",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    copyLabel: "Copy",
    copiedLabel: "Copied!",
    openInMaps: "Open in Maps",
    addToCalendar: "Add to calendar",
    googleCalendarLabel: "Google Calendar",
  },
};
