import { test, expect } from "@playwright/test";

// Skip the opening sequence so the sections below the fold are testable
// directly: the app already treats this sessionStorage key as "the guest
// already opened the envelope earlier" (see Invitation.tsx).
async function skipOpening(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("invitation:revealed", "1");
  });
}

test.describe("content sections", () => {
  test.beforeEach(async ({ page }) => {
    await skipOpening(page);
  });

  test("every M2 section renders with its localized heading, no console errors beyond missing art", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto("/demo?to=Drag%C4%83%20Ciprian%20%C8%99i%20Anastasia&lang=ro");

    await expect(
      page.getByRole("heading", { name: "Până la marea zi" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Povestea noastră" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Programul zilei" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Locația" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Codul vestimentar" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cadouri" })).toBeVisible();
    await expect(page.getByText("Cu drag, Valeria și Oleg")).toBeVisible();

    // The only acceptable console errors at this stage are 404s for
    // illustration assets the art track hasn't produced yet (M5).
    const unexpected = consoleErrors.filter(
      (text) => !text.includes("404") && !text.includes("illustrations/"),
    );
    expect(unexpected).toEqual([]);
  });

  test("countdown digits and venue calendar links are present", async ({
    page,
  }) => {
    await page.goto("/demo?to=Drag%C4%83%20Ciprian%20%C8%99i%20Anastasia&lang=ro");

    await expect(page.getByText("zile", { exact: true })).toBeVisible();
    await expect(page.getByText("ore", { exact: true })).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Deschide în Maps" }),
    ).toHaveAttribute("href", /maps\.google\.com/);
    await expect(
      page.getByRole("button", { name: "Adaugă în calendar" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Google Calendar" }),
    ).toHaveAttribute("href", /calendar\.google\.com/);
  });

  test("copying the IBAN shows the copied toast", async ({ page }) => {
    // WebKit (the "iPhone 15" project) has no grantable clipboard permission;
    // the write is allowed by default for a trusted click in this context.
    await page.goto("/demo?to=Drag%C4%83%20Ciprian%20%C8%99i%20Anastasia&lang=ro");

    await page.getByRole("button", { name: "Copiază" }).click();
    await expect(page.getByText("Copiat!")).toBeVisible();
  });
});
