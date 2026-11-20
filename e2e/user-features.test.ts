import { test, expect } from '@playwright/test'

test('user event registration flow', async ({ page }) => {
  // Login as user
  await page.goto('/auth/login')
  await page.fill('input[name="email"]', 'user@example.com')
  await page.fill('input[name="password"]', 'user123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL(/.*\/(dashboard|events)/)

  // Navigate to events
  await page.click('text=Events')
  await expect(page).toHaveURL(/.*\/events/)

  // Click on an event to register
  await page.click('text=Register')
  await expect(page.locator('.registration-form')).toBeVisible()

  // Fill registration form
  await page.fill('input[name="fullName"]', 'Test User')
  await page.fill('input[name="phone"]', '1234567890')

  // Submit registration
  await page.click('button[type="submit"]')

  // Verify registration successful
  await expect(page.locator('.success-message')).toContainText('Registration successful')
})

test('hall browsing and details', async ({ page }) => {
  await page.goto('/halls')

  // Click on a hall to view details
  await page.click('text=View Details')
  await expect(page).toHaveURL(/.*\/halls\/[0-9]+/)

  // Verify hall details displayed
  await expect(page.locator('.hall-details')).toBeVisible()
  await expect(page.locator('h1')).toContainText('Hall')
})