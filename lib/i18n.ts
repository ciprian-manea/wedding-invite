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
  rsvpNameLabel: string;
  rsvpAttendingLabel: string;
  rsvpYes: string;
  rsvpNo: string;
  rsvpSeatsLabel: string;
  rsvpAllergiesLabel: string;
  rsvpSongLabel: string;
  rsvpMessageLabel: string;
  rsvpSubmit: string;
  rsvpThankYou: string;
  rsvpErrorName: string;
  rsvpErrorAttending: string;
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
    rsvpNameLabel: "Numele tău",
    rsvpAttendingLabel: "Vii la nuntă?",
    rsvpYes: "Da",
    rsvpNo: "Nu",
    rsvpSeatsLabel: "Număr de persoane",
    rsvpAllergiesLabel: "Alergii alimentare",
    rsvpSongLabel: "O melodie pentru petrecere",
    rsvpMessageLabel: "Un mesaj pentru miri",
    rsvpSubmit: "Trimite confirmarea",
    rsvpThankYou: "Mulțumim pentru confirmare!",
    rsvpErrorName: "Te rugăm să scrii numele tău.",
    rsvpErrorAttending: "Te rugăm să alegi o opțiune.",
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
    rsvpNameLabel: "Ваше имя",
    rsvpAttendingLabel: "Вы придёте?",
    rsvpYes: "Да",
    rsvpNo: "Нет",
    rsvpSeatsLabel: "Количество гостей",
    rsvpAllergiesLabel: "Пищевые аллергии",
    rsvpSongLabel: "Песня для вечеринки",
    rsvpMessageLabel: "Сообщение молодожёнам",
    rsvpSubmit: "Отправить подтверждение",
    rsvpThankYou: "Спасибо за подтверждение!",
    rsvpErrorName: "Пожалуйста, укажите своё имя.",
    rsvpErrorAttending: "Пожалуйста, выберите вариант.",
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
    rsvpNameLabel: "Your name",
    rsvpAttendingLabel: "Will you attend?",
    rsvpYes: "Yes",
    rsvpNo: "No",
    rsvpSeatsLabel: "Number of guests",
    rsvpAllergiesLabel: "Food allergies",
    rsvpSongLabel: "A song for the party",
    rsvpMessageLabel: "A message for the couple",
    rsvpSubmit: "Send RSVP",
    rsvpThankYou: "Thank you for your RSVP!",
    rsvpErrorName: "Please tell us your name.",
    rsvpErrorAttending: "Please choose an option.",
  },
};
