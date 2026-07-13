import { test, expect } from "@playwright/test"

test.describe("Navigation", () => {
  test("language switcher is visible", async ({ page }) => {
    await page.goto("/zh")
    await expect(page.locator("select[aria-label='语言']")).toBeVisible()
  })

  test("mobile viewport shows content without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/zh")
    await expect(page.locator("h1")).toBeVisible()
  })

  test("champions ranking loads", async ({ page }) => {
    await page.goto("/zh/champions")
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 })
  })

  test("augments ranking loads", async ({ page }) => {
    await page.goto("/zh/augments")
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 })
  })

  test("items page loads", async ({ page }) => {
    await page.goto("/zh/items")
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 })
  })

  test("meta page loads", async ({ page }) => {
    await page.goto("/zh/meta")
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 })
  })

  test("patches page loads", async ({ page }) => {
    await page.goto("/zh/patches")
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 })
  })
})
