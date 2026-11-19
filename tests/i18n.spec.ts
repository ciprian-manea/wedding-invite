import { test, expect } from "@playwright/test";

// Language switching is disabled for now: content/demo.json's `languages`
// is ["ro"] and app/demo/page.tsx ignores `?lang=`. See docs/DECISIONS.md.
test.describe("languages", () => {
  test("no language switch buttons render, and ?lang= has no effect", async ({
    page,
  }) => {
    await page.goto(
      "/demo?to=Drag%C4%83%20Ciprian%20%C8%99i%20Anastasia&lang=ru",
    );

    await expect(
      page.getByRole("button", { name: "RO", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "RU", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByText("sunteți invitați la nunta noastră"),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  });

  test("RSVP's name field is prefilled from the guest line", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("invitation:revealed", "1");
    });
    await page.goto("/demo?to=Drag%C4%83%20Ciprian%20%C8%99i%20Anastasia");

    const nameInput = page.getByLabel("Numele tău");
    await expect(nameInput).toHaveValue("Dragă Ciprian și Anastasia");
  });
});
