import { test, expect } from "@playwright/test";

test("tap opens the envelope, plays the video, starts music and reveals the page", async ({
  page,
}) => {
  await page.goto("/demo?to=Dragă%20Vasile");

  const envelope = page.getByTestId("envelope");
  await expect(envelope).toBeVisible();

  await envelope.click();

  // The video's "playing" event fired, proving play() was called and accepted.
  await expect(page.locator("video")).toHaveAttribute("data-started", "true", {
    timeout: 5000,
  });

  // The tap is a user gesture, so the Web Audio graph must be running, not suspended.
  await expect(page.locator("audio")).toHaveAttribute(
    "data-context-state",
    "running",
    { timeout: 5000 },
  );

  // Phase reaches "revealed" (video ended or the 10s fallback fired) within 12s.
  await expect(page.locator("[data-phase]")).toHaveAttribute(
    "data-phase",
    "revealed",
    { timeout: 12000 },
  );

  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  expect(bodyOverflow).not.toBe("hidden");
});
