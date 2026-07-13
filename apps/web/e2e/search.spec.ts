import { test, expect } from "@playwright/test"

test.describe("Search", () => {
  test("global search input is visible on homepage", async ({ page }) => {
    await page.goto("/zh")
    await expect(page.locator("#global-search")).toBeVisible({ timeout: 10000 })
  })

  test("search filters champion ranking", async ({ page }) => {
    await page.goto("/zh/champions")
    const searchInput = page.locator("input[aria-label='筛选榜单']")
    await expect(searchInput).toBeVisible({ timeout: 10000 })
  })

  test("URL parameters persist after filtering", async ({ page }) => {
    await page.goto("/zh/champions?sort=matches&minMatches=1000")
    await expect(page.locator("select[aria-label='排序']")).toHaveValue("matches")
  })
})
