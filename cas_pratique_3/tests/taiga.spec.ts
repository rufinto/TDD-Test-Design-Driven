import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { IssuesPage } from '../pages/issues.page';
import { USERNAME, PASSWORD, PROJECT_SLUG } from '../utils/test-data';

test('ouvrir la page des issues', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const issuesPage = new IssuesPage(page);

  await loginPage.goto();
  await loginPage.login(USERNAME, PASSWORD);
  await dashboardPage.selectProject(PROJECT_SLUG);
  await issuesPage.navigate();

  await issuesPage.createIssue(
    'Issue de test',
    'Description de test via Playwright',
    'Bug',
    'Minor',
    'Low'
  );
});