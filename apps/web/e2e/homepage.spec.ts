import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("redirects root to a locale", async ({ page }) => {
    const response = await page.goto("/")
    // Proxy auto-detects locale from Accept-Language; Playwright sends en
    expect(response?.url()).toMatch(/http:\/\/localhost:3000\/(zh|en|ko)/)
  })

  test("displays main heading", async ({ page }) => {
    await page.goto("/zh")
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 })
  })

  test("shows top champion section", async ({ page }) => {
    await page.goto("/zh")
    await expect(page.locator("text=胜率持续上升")).toBeVisible({ timeout: 15000 })
  })

  test("navigates to champions page via link", async ({ page }) => {
    await page.goto("/zh")
    const link = page.locator('a:has-text("查看全部英雄")').first()
    await link.scrollIntoViewIfNeeded()
    await link.click({ timeout: 10000 })
    await expect(page).toHaveURL(/\/zh\/champions/)
  })

  test("has mode entry links", async ({ page }) => {
    await page.goto("/zh")
    await expect(page.locator("h3:has-text('召唤师峡谷')")).toBeVisible({ timeout: 10000 })
    await expect(page.locator("h3:has-text('大乱斗')")).toBeVisible()
  })
})
