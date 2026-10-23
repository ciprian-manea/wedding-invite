# Project

## Goal of this step
Build a draft of ONE complete wedding invitation that looks and feels premium on a phone:
sealed envelope → tap → opening video + music → scrolling invitation with animated sections.

The draft must be a reusable template: a second wedding = a new JSON file + new media, no code changes.

## Who uses it
- **Guests** open a link on their phone, usually from WhatsApp (in-app browser on iOS and Android).
  Most use iPhone Safari or Chrome on Android. Many are older and not technical:
  the envelope must say clearly "tap to open", text must be large and easy to read.
- **The owner (developer)** fills in the JSON and media for each wedding by hand.

## In scope (this step)
- Opening sequence: poster with the guest's name, opening video, music, hand-off to the page.
- Sections: cover, countdown, our story, schedule, venue + add to calendar, dress code,
  gifts, scratch-to-reveal date, RSVP form (UI only), footer.
- Languages: Romanian (ro), Russian (ru), English (en); guest can switch on the envelope screen.
- One design called **Jardin Blanc** (ivory paper, white flowers, sage green seal).
- Temporary personalisation for the draft: guest line from the URL, `/demo?to=Dragă%20Vasile`.
  Falls back to the generic greeting from the JSON.
- Deploy a preview to Vercel.

## Out of scope (later steps, do not build now)
- Per-guest tokens, guests.csv and the make-links script (next step).
- Saving RSVPs anywhere (next step: Google Sheets).
- The presentation / sales page.
- Database, accounts, dashboard, admin, payments, emails.

## Definition of done for the draft
- Opens in under 2.5 s to a tappable envelope on a 4G phone.
- Tap → video plays smoothly, music fades in, hand-off to the page has no visible jump.
- Works on a real iPhone (Safari and the WhatsApp in-app browser) and a real Android (Chrome).
- All sections render from `content/demo.json`, in all three languages.
- Lighthouse mobile performance ≥ 90, no console errors, reduced motion respected.
