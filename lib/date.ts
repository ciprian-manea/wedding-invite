import type { Lang } from "./content/schema";

const LOCALE_BY_LANG: Record<Lang, string> = {
  ro: "ro-RO",
  ru: "ru-RU",
  en: "en-GB",
};

export function formatEventDate(dateTime: string, lang: Lang): string {
  const date = new Date(dateTime);
  return new Intl.DateTimeFormat(LOCALE_BY_LANG[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export type TimeRemaining = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getTimeRemaining(target: Date, now: Date): TimeRemaining {
  const totalMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(totalMs / 1000);
  return {
    totalMs,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}
