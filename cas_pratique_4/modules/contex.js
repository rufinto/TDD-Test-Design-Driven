import { check, fail, group } from 'k6';
import http from 'k6/http';
import { BASE_URL, PROJECT_NAME, PROJECT_SLUG } from '../utils/config.js';

export function initProject(token) {
	let projectId;
	let response;

	group('INIT PROJECT CONTEXT', function () {
		const headers = {
			Authorization: `Bearer ${token}`,
		};

		response = http.get(
			`${BASE_URL}/api/v1/projects?member=5&order_by=user_order&slight=true`,
			{
				headers: headers,
			},
		);

		const ok = check(response, {
			'01-status 200': (r) => r.status === 200,
			'01-body has projects': (r) => r.json().length > 0,
			'01-body has correct project': (r) =>
				r.json().some((p) => p.name === PROJECT_NAME),
		});

		if (!ok) {
			fail('Failed to load projects');
		}

		response = http.get(
			`${BASE_URL}/api/v1/epics?assigned_to=5&status__is_closed=false`,
			{
				headers: headers,
			},
		);

		check(response, {
			'02-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/userstories?assigned_users=5&dashboard=true&is_closed=false`,
			{
				headers: headers,
			},
		);

		check(response, {
			'03-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/tasks?assigned_to=5&status__is_closed=false`,
			{
				headers: headers,
			},
		);

		check(response, {
			'04-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/issues?assigned_to=5&status__is_closed=false`,
			{
				headers: headers,
			},
		);

		check(response, {
			'05-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/epics?status__is_closed=false&watchers=5`,
			{
				headers: headers,
			},
		);

		check(response, {
			'06-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/userstories?dashboard=true&is_closed=false&watchers=5`,
			{
				headers: headers,
			},
		);

		check(response, {
			'07-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/tasks?status__is_closed=false&watchers=5`,
			{
				headers: headers,
			},
		);

		check(response, {
			'08-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/issues?status__is_closed=false&watchers=5`,
			{
				headers: headers,
			},
		);

		check(response, {
			'09-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/web-notifications?only_unread=true&page=1`,
			{
				headers: headers,
			},
		);

		check(response, {
			'10-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/projects/by_slug?slug=${PROJECT_SLUG}`,
			{ headers },
		);

		check(response, {
			'11-status 200': (r) => r.status === 200,
			'11-project name is correct': (r) => r.json('name') === PROJECT_NAME,
			'11-project slug is correct': (r) => r.json('slug') === PROJECT_SLUG,
		});

		projectId = response.json('id');

		response = http.get(
			`${BASE_URL}/api/v1/timeline/project/${projectId}?only_relevant=true&page=1`,
			{
				headers: headers,
			},
		);

		check(response, {
			'14-status 200': (r) => r.status === 200,
		});
	});

	return {
		projectId,
	};
}
