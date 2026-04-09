import { Page, expect } from '@playwright/test';

export class IssuesPage {
  constructor(private page: Page) {}

  async navigate() {
    const issuesLink = this.page.getByRole('link', { name: 'Issues' });
    await expect(issuesLink).toBeVisible({ timeout: 10000 });
    await issuesLink.click();
    await expect(this.page).toHaveURL(/issues/i, { timeout: 10000 });
  }

  async createIssue(subject: string, description: string, type: string, severity: string, priority: string) {
  // Ouvrir le formulaire
  await this.page.getByRole('button', { name: 'NEW ISSUE' }).click();

  // Remplir le sujet
  await this.page.getByRole('textbox', { name: 'Subject' }).fill(subject);

  // Remplir la description
  await this.page.getByRole('textbox', { name: 'Please add descriptive text' }).fill(description);

// Sélectionner le type
await this.page.getByText(/Type\s+Bug\s+Bug\s+Question/).click();
await this.page.locator('.popover.pop-type a[title="' + type + '"]').click({ force: true });
// Appuyer sur Tab pour sortir du popover et le fermer
await this.page.keyboard.press('Tab');
await this.page.keyboard.press('Tab');

// Vérifier que le popover type est bien fermé
await expect(
  this.page.locator('.popover.pop-type.active')
).not.toBeAttached({ timeout: 5000 });

// Sélectionner la sévérité
await this.page.getByText(/Severity\s+Normal\s+Wishlist/).click({ force: true });
await this.page.locator('.popover.pop-severity a[title="' + severity + '"]').click();

// Sélectionner la priorité
await this.page.getByText(/Priority\s+Normal\s+Low\s+Normal/).click({ force: true });
await this.page.locator('.popover.pop-priority a[title="' + priority + '"]').click();
// Valider
await this.page.getByRole('button', { name: 'Create' }).click();

// Vérification
await expect(this.page.getByText(subject)).toBeVisible({ timeout: 10000 });
}
}