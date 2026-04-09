import { Page, expect } from '@playwright/test';
import { BASE_URL } from '../utils/test-data';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(`${BASE_URL}/login`);
  }

  async login(username: string, password: string) {
    await this.page.getByRole('textbox', { name: /Username or email/i }).fill(username);
    await this.page.getByRole('textbox', { name: /Password/i }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();

    // Vérification : on est bien connecté (le dashboard charge)
    await expect(this.page).not.toHaveURL(/\/login/i, { timeout: 10000 });
  }
}