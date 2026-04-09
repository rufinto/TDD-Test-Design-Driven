import { SharedArray } from 'k6/data';

const issuesData = new SharedArray('issues', function () {
	return JSON.parse(open('../data/issues.json'));
});

export function getIssueData() {
	const index = __ITER % issuesData.length;
	return issuesData[index];
}

export function randomSleep() {
	return Math.random() * 3;
}
