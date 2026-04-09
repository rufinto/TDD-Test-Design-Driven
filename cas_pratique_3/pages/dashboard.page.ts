import { Page, expect } from '@playwright/test';
import { BASE_URL } from '../utils/test-data';

export class DashboardPage {
  constructor(private page: Page) {}

  async selectProject(projectSlug: string) {
    // Navigation directe vers le projet via son slug
    await this.page.goto(`${BASE_URL}/project/${projectSlug}/issues`);

    // Vérification : on est bien dans le projet
    await expect(this.page).toHaveURL(/project\//, { timeout: 15000 });
  }
}