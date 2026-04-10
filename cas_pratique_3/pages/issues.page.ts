import { Page, expect } from '@playwright/test';

type IssueData = {
  subject: string;
  description: string;
  type: string;
  severity: string;
  priority: string;
};

export class IssuesPage {
  constructor(private page: Page) {}

  async navigate() {
    const issuesLink = this.page.getByRole('link', { name: 'Issues' });
    await expect(issuesLink).toBeVisible({ timeout: 10000 });
    await issuesLink.click();
    await expect(this.page).toHaveURL(/issues/i, { timeout: 10000 });
  }

  async createIssue(
    subject: string,
    description: string,
    type: string,
    severity: string,
    priority: string
  ) {
    await this.page.getByRole('button', { name: /new issue/i }).click();

    await this.page.getByRole('textbox', { name: /subject/i }).fill(subject);
    await this.page.getByRole('textbox', { name: /please add descriptive text/i }).fill(description);

    await this.selectOption('tg-issue-type-button', '.popover.pop-type', type);
    await this.selectOption('tg-issue-severity-button', '.popover.pop-severity', severity);
    await this.selectOption('tg-issue-priority-button', '.popover.pop-priority', priority);

    const createButton = this.page.getByRole('button', { name: /^Create$/ });
    await expect(createButton).toBeVisible({ timeout: 10000 });
    await expect(createButton).toBeEnabled({ timeout: 10000 });
    await createButton.click();

    await expect(this.page.getByText(subject, { exact: true })).toBeVisible({ timeout: 10000 });
  }

  async createIssuesFromList(issues: IssueData[]) {
  const runId = Date.now();

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];

    await this.createIssue(
      `${issue.subject} ${runId}-${i}`,
      issue.description,
      issue.type,
      issue.severity,
      issue.priority
    );

    await expect(this.page.getByRole('button', { name: /new issue/i })).toBeVisible({
      timeout: 10000,
    });
  }
}

  async filterIssues(type: string, severity: string) {
  await this.page.getByRole('button', { name: 'Filters' }).click();
  await this.page.getByRole('button', { name: 'Type' }).click();
  await this.page.getByRole('button', { name: type }).click();
  await this.page.getByRole('button', { name: 'Severity' }).click();
  await this.page.getByRole('button', { name: severity }).click();

    await this.page.waitForTimeout(5000);
}

  async searchIssue(searchValue: string) {
    const searchInput = this.page.locator('input[placeholder*="Search"], input[type="search"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill(searchValue);
    await searchInput.press('Enter');
  }

  async openIssueBySubject(subject: string) {
    const issueLink = this.page.getByText(subject, { exact: true }).first();
    await expect(issueLink).toBeVisible({ timeout: 10000 });
    await issueLink.click();
  }

  async deleteCurrentIssue() {
    // 1. Fermer la bannière cookie si présente
    const cookieClose = this.page
      .locator('cookie-warning')
      .getByRole('link', { name: /close/i });

    if (await cookieClose.count()) {
      if (await cookieClose.first().isVisible().catch(() => false)) {
        await cookieClose.first().click();
      }
    }

    // 2. Cliquer sur le bouton delete (icône)
    const deleteIcon = this.page.locator('.btn-icon.button-delete');
    await expect(deleteIcon).toBeVisible({ timeout: 10000 });
    await deleteIcon.click();

    // 3. Confirmer la suppression
    const confirmButton = this.page.getByRole('button', { name: 'Delete' });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });
    await confirmButton.click();
  }

  async expectIssueNotVisible(subject: string) {
    const matchingIssueLinks = this.page.getByRole('link').filter({
      hasText: subject,
    });

    await expect(matchingIssueLinks).toHaveCount(0, { timeout: 10000 });
  }

  private async selectOption(
    buttonSelector: string,
    popoverSelector: string,
    value: string
  ) {
    const button = this.page.locator(buttonSelector).first();
    await expect(button).toBeVisible({ timeout: 10000 });

    // Premier essai
    await button.click();

    let activePopover = this.page.locator(`${popoverSelector}.active`).last();

    // Si le popover ne s'ouvre pas, on retente une fois proprement
    if (!(await activePopover.isVisible().catch(() => false))) {
      await this.page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
      await button.click();
      activePopover = this.page.locator(`${popoverSelector}.active`).last();
    }

    await expect(activePopover).toBeVisible({ timeout: 5000 });

    const option = activePopover.locator(`a[title="${value}"], a:has-text("${value}")`).first();
    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click();

    // Fermer proprement
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});

    await expect(this.page.locator(`${popoverSelector}.active`)).toHaveCount(0, {
      timeout: 5000,
    });
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}