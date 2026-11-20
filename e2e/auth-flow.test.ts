import { test, expect } from '@playwright/test'

test('complete auth flow - login and logout', async ({ page }) => {
  // Navigate to login page
  await page.goto('/auth/login')

  // Fill in login form
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')

  // Click login button
  await page.click('button[type="submit"]')

  // Verify redirected to dashboard or home
  await expect(page).toHaveURL(/.*\/(dashboard|events|halls)/)

  // Click logout
  await page.click('text=Logout')

  // Verify redirected back to login
  await expect(page).toHaveURL('/auth/login')
})

test('complete auth flow - signup user', async ({ page }) => {
  // Navigate to signup page
  await page.goto('/auth/signup/user')

  // Fill in signup form
  await page.fill('input[name="name"]', 'Test User')
  await page.fill('input[name="email"]', 'test2@example.com')
  await page.selectOption('select[name="role"]', 'user')
  await page.fill('input[name="password"]', 'password123')

  // Click signup button
  await page.click('button[type="submit"]')

  // Verify account created message or redirect
  await expect(page.locator('.success-message')).toBeVisible()
})

test('navigation between main sections', async ({ page }) => {
  await page.goto('/')

  // Navigate to events
  await page.click('text=Events')
  await expect(page).toHaveURL(/.*\/events/)

  // Navigate to halls
  await page.click('text=Halls')
  await expect(page).toHaveURL(/.*\/halls/)

  // Navigate to categories
  await page.click('text=Categories')
  await expect(page).toHaveURL(/.*\/categories/)
})