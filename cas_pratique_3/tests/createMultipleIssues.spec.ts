import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { IssuesPage } from '../pages/issues.page';
import { USERNAME, PASSWORD, PROJECT_SLUG } from '../utils/test-data';
import issues from '../data/issues.json';

test('créer 20 anomalies depuis un fichier JSON', async ({ page }) => {
  test.setTimeout(180000); // Augmenter le timeout pour ce test
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const issuesPage = new IssuesPage(page);

  await loginPage.goto();
  await loginPage.login(USERNAME, PASSWORD);
  await dashboardPage.selectProject(PROJECT_SLUG);
  await issuesPage.navigate();

  await issuesPage.createIssuesFromList(issues);
});