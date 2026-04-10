import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { IssuesPage } from '../pages/issues.page';
import { USERNAME, PASSWORD, PROJECT_SLUG } from '../utils/test-data';

test('rechercher une anomalie et la supprimer', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const issuesPage = new IssuesPage(page);

  const subject = `Issue à supprimer ${Date.now()}`;

  await loginPage.goto();
  await loginPage.login(USERNAME, PASSWORD);
  await dashboardPage.selectProject(PROJECT_SLUG);
  await issuesPage.navigate();

  await issuesPage.createIssue(
    subject,
    'Issue créée pour test de suppression',
    'Bug',
    'Critical',
    'High'
  );

  await issuesPage.searchIssue(subject);
  await issuesPage.openIssueBySubject(subject);
  await issuesPage.deleteCurrentIssue();

  await issuesPage.navigate();
  await issuesPage.searchIssue(subject);
  await issuesPage.expectIssueNotVisible(subject);
});