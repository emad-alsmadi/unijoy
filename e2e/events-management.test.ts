import { test, expect } from '@playwright/test'

test('event creation and management flow', async ({ page }) => {
  // Login as admin first
  await page.goto('/auth/admin/login')
  await page.fill('input[name="email"]', 'admin@example.com')
  await page.fill('input[name="password"]', 'admin123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/admin')

  // Navigate to create event
  await page.click('text=Create Event')
  await expect(page).toHaveURL('/admin/events/create')

  // Fill event form
  await page.fill('input[name="title"]', 'Test Conference')
  await page.fill('input[name="description"]', 'A test conference event')
  await page.fill('input[name="date"]', '2024-12-15')
  await page.fill('input[name="location"]', 'Test Venue')
  await page.fill('input[name="capacity"]', '200')

  // Submit event creation
  await page.click('button[type="submit"]')

  // Verify event created
  await expect(page.locator('.success-message')).toContainText('Event created successfully')

  // Navigate to view events
  await page.click('text=Manage Events')
  await expect(page).toHaveURL('/admin/events')

  // Verify test event is listed
  await expect(page.locator('tr', { hasText: 'Test Conference' })).toBeVisible()
})

test('hall management flow', async ({ page }) => {
  await page.goto('/admin/halls')

  // Click create hall
  await page.click('text=Create Hall')
  await expect(page).toHaveURL('/admin/halls/create')

  // Fill hall form
  await page.fill('input[name="name"]', 'Grand Hall')
  await page.fill('input[name="capacity"]', '500')
  await page.fill('input[name="price"]', '50.00')

  // Submit
  await page.click('button[type="submit"]')

  // Verify created
  await expect(page.locator('.success-message')).toContainText('Hall created successfully')

  // Verify hall appears in list
  await expect(page.locator('td', { hasText: 'Grand Hall' })).toBeVisible()
})