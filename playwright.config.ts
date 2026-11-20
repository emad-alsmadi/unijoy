import { test, expect } from '@playwright/test'

export default {
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : 1,
  reporter: ['github', ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    viewport: { width: 1920, height: 1080 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
}