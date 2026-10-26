import { test, expect, type Page } from "@playwright/test";

async function skipOpening(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("invitation:revealed", "1");
  });
}

test.describe("languages", () => {
  test("?lang=ru loads Russian content directly, with <html lang> set", async ({
    page,
  }) => {
    await skipOpening(page);
    await page.goto("/demo?to=Drag%C4%83%20Vasile&lang=ru");

    await expect(
      page.getByRole("heading", { name: "До большого дня" }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  });

  test("switching language on the envelope (before tap) updates the greeting and <html lang>", async ({
    page,
  }) => {
    await page.goto("/demo?to=Drag%C4%83%20Vasile&lang=ro");

    await expect(
      page.getByText("sunteți invitați la nunta noastră"),
    ).toBeVisible();

    await page.getByRole("button", { name: "RU", exact: true }).click();

    await expect(
      page.getByText("приглашаем вас на нашу свадьбу"),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    await expect(page).toHaveURL(/lang=ru/);
  });

  test("the persistent switcher after reveal updates every section and the URL, without a reload", async ({
    page,
  }) => {
    await skipOpening(page);
    await page.goto("/demo?to=Drag%C4%83%20Vasile&lang=ro");

    await expect(
      page.getByRole("heading", { name: "Programul zilei" }),
    ).toBeVisible();
    // The envelope briefly coexists with the persistent switcher while its
    // own exit animation finishes (see Invitation.tsx's hydration-safe
    // "revealed from storage" handling), so wait for it to fully leave the
    // DOM before relying on there being only one "EN" button.
    await expect(page.getByTestId("envelope")).toHaveCount(0);

    await page.getByRole("button", { name: "EN", exact: true }).click();

    await expect(
      page.getByRole("heading", { name: "The schedule" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Dress code" }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveURL(/lang=en/);
  });

  test("RSVP's name field is prefilled from the guest line", async ({
    page,
  }) => {
    await skipOpening(page);
    await page.goto("/demo?to=Drag%C4%83%20Vasile&lang=ro");

    const nameInput = page.getByLabel("Numele tău");
    await expect(nameInput).toHaveValue("Dragă Vasile");
  });
});
