import { test, expect } from "@playwright/test";

test.describe("On the clock page", () => {
  test("the London clock should be visible ", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("London")).toBeVisible();
  });

  test("it should be possible to create and clear an error", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Create an error" }).click();
    await expect(page.getByText("Why did you create problems on purpose?")).toBeVisible();
    await page.getByRole("button", { name: "Clear errors" }).click();
    await expect(page.getByText("problems")).not.toBeVisible();
  });
});
