import { check, fail, group } from 'k6';
import http from 'k6/http';
import { BASE_URL } from '../utils/config.js';

export function viewIssues(token, projectId, shouldFind = false) {
	let response;

	group(`VIEW_ISSUES`, function () {
		const headers = {
			Authorization: `Bearer ${token}`,
		};

		response = http.get(
			`${BASE_URL}/api/v1/issues/filters_data?project=${projectId}`,
			{ headers },
		);

		check(response, {
			'01-status 200': (r) => r.status === 200,
		});

		response = http.get(`${BASE_URL}/api/v1/issues?project=${projectId}`, {
			headers,
		});

		check(response, {
			'02-status 200': (r) => r.status === 200,
			'02-body has issues': (r) => r.json().length >= 0,
		});

		if (shouldFind) {
			check(response, {
				'02-body has matching issue': (r) => r.json().length > 0,
			});
		}
	});
}

export function searchIssue(token, projectId, query, shouldFind = false) {
	let response;

	group(`SEARCH_ISSUE`, function () {
		const headers = {
			Authorization: `Bearer ${token}`,
		};

		response = http.get(
			`${BASE_URL}/api/v1/issues?project=${projectId}&q=${query}`,
			{ headers },
		);

		check(response, {
			'01-status 200': (r) => r.status === 200,
			'01-body has issues': (r) => r.json().length >= 0,
		});

		if (shouldFind) {
			check(response, {
				'01-body has matching issue': (r) =>
					r
						.json()
						.some((issue) =>
							issue.subject.toLowerCase().includes(query.toLowerCase()),
						),
			});
		}
	});
}

export function createIssue(token, projectId, data) {
	let response;
	let issueId;

	group(`CREATE_ISSUE`, function () {
		const headers = {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		};

		const payload = JSON.stringify({
			priority: parseInt(data.priority),
			project: projectId,
			severity: parseInt(data.severity),
			status: parseInt(data.status),
			subject: data.subject,
			tags: data.tags || [],
			type: parseInt(data.type),
			description: data.description,
		});

		response = http.post(`${BASE_URL}/api/v1/issues`, payload, { headers });

		const ok = check(response, {
			'01-status 201': (r) => r.status === 201,
			'01-body has id': (r) => r.json('id') !== undefined,
			'01-body has correct subject': (r) => r.json('subject') === data.subject,
		});

		if (!ok) {
			fail('Create issue failed');
		}

		issueId = response.json('id');
	});

	return issueId;
}

export function updateIssue(token, issueId) {
	let response;

	group(`UPDATE_ISSUE`, function () {
		const headers = {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		};

		response = http.get(`${BASE_URL}/api/v1/issues/${issueId}`, { headers });

		const ok = check(response, {
			'01-status 200': (r) => r.status === 200,
			'01-body has version': (r) => r.json('version') !== undefined,
		});

		if (!ok) {
			fail('Get issue for update failed');
		}

		const version = response.json('version');

		const payload = JSON.stringify({
			severity: 3,
			version: version,
		});

		response = http.patch(`${BASE_URL}/api/v1/issues/${issueId}`, payload, {
			headers,
		});

		check(response, {
			'02-status 200': (r) => r.status === 200,
			'02-body has correct severity': (r) => r.json('severity') === 3,
			'02-body has version incremented': (r) =>
				r.json('version') === version + 1,
		});
	});
}

export function deleteIssue(token, issueId) {
	let response;

	group(`DELETE_ISSUE`, function () {
		const headers = {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		};

		response = http.del(`${BASE_URL}/api/v1/issues/${issueId}`, '{}', {
			headers,
		});

		const ok = check(response, {
			'01-status 204': (r) => r.status === 204,
		});

		if (!ok) {
			fail('Delete issue failed');
		}
	});
}
