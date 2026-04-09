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
	scenarios: {
		search_issue: {
			executor: 'constant-vus',
			exec: 'vu_search_issue',
			vus: 75,
			duration: '10m',
		},
		create_issue: {
			executor: 'constant-vus',
			exec: 'vu_create_issue',
			vus: 15,
			duration: '10m',
		},
		update_issue: {
			executor: 'constant-vus',
			exec: 'vu_update_issue',
			vus: 10,
			duration: '10m',
		},
		delete_issue: {
			executor: 'constant-vus',
			exec: 'vu_delete_issue',
			vus: 10,
			duration: '10m',
		},
	},
	thresholds: {
		'http_req_duration{scenario:search_issue}': ['p(95)<2000'],
		'http_req_duration{scenario:create_issue}': ['p(95)<5000'],
		'http_req_duration{scenario:update_issue}': ['p(95)<5000'],
		'http_req_duration{scenario:delete_issue}': ['p(95)<5000'],
		http_req_failed: ['rate<0.01'],
	},
};

export function setup() {
	console.log('Setup - Login and initialize project');
	const token = login();
	const { projectId } = initProject(token);
	return { token, projectId };
}

export function vu_search_issue(data) {
	viewIssues(data.token, data.projectId);
	searchIssue(data.token, data.projectId, 'issue');
	sleep(randomSleep());
}

export function vu_create_issue(data) {
	viewIssues(data.token, data.projectId);
	const dataIssue = getIssueData();
	createIssue(data.token, data.projectId, dataIssue);
	sleep(randomSleep());
}

export function vu_update_issue(data) {
	viewIssues(data.token, data.projectId);
	const dataIssue = getIssueData();
	const issueId = createIssue(data.token, data.projectId, dataIssue);
	updateIssue(data.token, issueId);
	sleep(randomSleep());
}

export function vu_delete_issue(data) {
	viewIssues(data.token, data.projectId);
	const dataIssue = getIssueData();
	const issueId = createIssue(data.token, data.projectId, dataIssue);
	deleteIssue(data.token, issueId);
	sleep(randomSleep());
}

export function teardown() {
	console.log('--- Test completed ---');
}
