import { z } from "zod";

export const langSchema = z.enum(["ro", "ru", "en"]);
export type Lang = z.infer<typeof langSchema>;

const localizedSchema = z.partialRecord(langSchema, z.string());
export type Localized = z.infer<typeof localizedSchema>;

const coverSectionSchema = z.object({
  type: z.literal("cover"),
  subtitle: localizedSchema,
  quote: localizedSchema.optional(),
});

const countdownSectionSchema = z.object({
  type: z.literal("countdown"),
  title: localizedSchema,
});

const storySectionSchema = z.object({
  type: z.literal("story"),
  title: localizedSchema,
  text: localizedSchema,
  photos: z.array(
    z.object({
      src: z.string(),
      alt: localizedSchema,
    }),
  ),
});

const scheduleIconSchema = z.enum([
  "rings",
  "church",
  "glass",
  "dinner",
  "music",
  "cake",
]);

const scheduleSectionSchema = z.object({
  type: z.literal("schedule"),
  title: localizedSchema,
  items: z.array(
    z.object({
      time: z.string(),
      title: localizedSchema,
      place: localizedSchema.optional(),
      icon: scheduleIconSchema,
    }),
  ),
});

const venueSectionSchema = z.object({
  type: z.literal("venue"),
  title: localizedSchema,
  places: z.array(
    z.object({
      name: z.string(),
      address: z.string(),
      mapsUrl: z.string(),
      image: z.string().optional(),
      addToCalendar: z.boolean(),
    }),
  ),
});

const dressCodeSectionSchema = z.object({
  type: z.literal("dressCode"),
  title: localizedSchema,
  text: localizedSchema,
  palette: z.array(z.string()),
});

const giftsSectionSchema = z.object({
  type: z.literal("gifts"),
  title: localizedSchema,
  text: localizedSchema,
  iban: z.string().optional(),
  holder: z.string().optional(),
});

const scratchRevealSectionSchema = z.object({
  type: z.literal("scratchReveal"),
  title: localizedSchema,
  hint: localizedSchema,
});

const rsvpSectionSchema = z.object({
  type: z.literal("rsvp"),
  title: localizedSchema,
  text: localizedSchema,
  askAllergies: z.boolean(),
  askSong: z.boolean(),
  maxSeats: z.number().int().positive(),
});

const footerSectionSchema = z.object({
  type: z.literal("footer"),
  text: localizedSchema,
});

const sectionSchema = z.discriminatedUnion("type", [
  coverSectionSchema,
  countdownSectionSchema,
  storySectionSchema,
  scheduleSectionSchema,
  venueSectionSchema,
  dressCodeSectionSchema,
  giftsSectionSchema,
  scratchRevealSectionSchema,
  rsvpSectionSchema,
  footerSectionSchema,
]);
export type Section = z.infer<typeof sectionSchema>;

export const contentSchema = z.object({
  slug: z.string(),
  design: z.literal("jardin-blanc"),
  languages: z.array(langSchema).min(1),
  defaultLanguage: langSchema,
  couple: z.object({
    partner1: z.string(),
    partner2: z.string(),
    monogram: z.string(),
  }),
  greeting: z.object({
    generic: localizedSchema,
    invitedLine: localizedSchema,
    tapToOpen: localizedSchema,
  }),
  event: z.object({
    dateTime: z.string(),
    timezone: z.string(),
    rsvpDeadline: z.string(),
  }),
  music: z.object({
    src: z.string(),
    credit: z.string().optional(),
  }),
  sections: z.array(sectionSchema),
});

export type Content = z.infer<typeof contentSchema>;
