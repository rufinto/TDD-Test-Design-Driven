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
	vus: 1,
	duration: '30s',
	thresholds: { http_req_duration: ['p(99)<1500'] },
};

export default function main() {
	const token = login();

	const { projectId } = initProject(token);

	viewIssues(token, projectId, true);

	const data = getIssueData();

	console.log(`VU ${__VU} - Iteration ${__ITER} : Add issue "${data.subject}"`);

	const issueId = createIssue(token, projectId, data);

	searchIssue(token, projectId, 'issue', true);

	updateIssue(token, issueId);

	deleteIssue(token, issueId);

	logout();

	sleep(randomSleep());
}
