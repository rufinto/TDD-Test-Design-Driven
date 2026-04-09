import { sleep } from 'k6';
import { login, logout } from '../modules/auth.js';
import { initProject } from '../modules/contex.js';
import {
	createIssue,
	deleteIssue,
	searchIssue,
	updateIssue,
	viewIssues,
} from '../modules/issues.js';
import { getIssueData, randomSleep } from '../utils/helpers.js';

export const options = {
	stages: [
		{ duration: '2m', target: 40 },
		{ duration: '8h', target: 40 },
		{ duration: '2m', target: 0 },
	],
	thresholds: {
		http_req_duration: ['p(95)<500'],
		http_req_failed: ['rate<0.01'],
	},
};

export default function main() {
	const token = login();

	const { projectId } = initProject(token);

	viewIssues(token, projectId);

	const data = getIssueData();
	const issueId = createIssue(token, projectId, data);

	searchIssue(token, projectId, 'issue');

	updateIssue(token, issueId);

	deleteIssue(token, issueId);

	logout();

	sleep(randomSleep());
}
