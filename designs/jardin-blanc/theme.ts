export const theme = {
  color: {
    paper: "#F7F2E8",
    paperDeep: "#EDE4D3",
    ink: "#3E3A33",
    inkSoft: "#766E63",
    accent: "#667359",
    accentSoft: "#C9D1BC",
    gold: "#B89B6A",
    error: "#B3443A",
  },
  radius: {
    card: "20px",
  },
  ease: {
    soft: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
} as const;

export type Theme = typeof theme;

export const themeCssVars: Record<string, string> = {
  "--color-paper": theme.color.paper,
  "--color-paper-deep": theme.color.paperDeep,
  "--color-ink": theme.color.ink,
  "--color-ink-soft": theme.color.inkSoft,
  "--color-accent": theme.color.accent,
  "--color-accent-soft": theme.color.accentSoft,
  "--color-gold": theme.color.gold,
  "--color-error": theme.color.error,
  "--radius-card": theme.radius.card,
  "--ease-soft": theme.ease.soft,
};
