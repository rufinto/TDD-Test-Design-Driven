import { check, fail, group } from 'k6';
import http from 'k6/http';
import {
	BASE_URL,
	EMAIL,
	PASSWORD,
	PROJECT_SLUG,
	USERNAME,
} from '../utils/config.js';

const defaultHeaders = {
	'Content-Type': 'application/json',
};

export function login() {
	let response;
	let token;

	group(`LOGIN - /login`, function () {
		response = http.get(`${BASE_URL}/login`, {
			headers: defaultHeaders,
		});

		check(response, {
			'01-status 200': (r) => r.status === 200,
		});

		const payload = JSON.stringify({
			type: 'normal',
			username: USERNAME,
			password: PASSWORD,
		});

		response = http.post(`${BASE_URL}/api/v1/auth`, payload, {
			headers: defaultHeaders,
		});

		const ok = check(response, {
			'02-status 200': (r) => r.status === 200,
			'02-body has token': (r) => r.json('auth_token') !== undefined,
			'02-body has username': (r) => r.json('username') === USERNAME,
			'02-body has email': (r) => r.json('email') === EMAIL,
		});

		if (!ok) {
			fail('Login failed');
		}

		token = response.json('auth_token');
	});

	return token;
}

export function logout() {
	let response;

	group(`LOGOUT`, function () {
		response = http.get(`${BASE_URL}/api/v1/stats/discover`, {
			headers: defaultHeaders,
		});

		check(response, {
			'1-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/projects/by_slug?slug=${PROJECT_SLUG}`,
			{
				headers: defaultHeaders,
				responseCallback: http.expectedStatuses(401),
			},
		);

		const ok = check(response, {
			'2-status 401': (r) => r.status === 401,
		});

		if (!ok) {
			fail('Logout failed');
		}

		response = http.get(
			`${BASE_URL}/api/v1/projects?discover_mode=true&is_featured=true`,
			{
				headers: defaultHeaders,
			},
		);

		check(response, {
			'3-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/projects?discover_mode=true&order_by=-total_fans_last_year`,
			{
				headers: defaultHeaders,
			},
		);

		check(response, {
			'4-status 200': (r) => r.status === 200,
		});

		response = http.get(
			`${BASE_URL}/api/v1/projects?discover_mode=true&order_by=-total_activity_last_year`,
			{
				headers: defaultHeaders,
			},
		);

		check(response, {
			'5-status 200': (r) => r.status === 200,
		});
	});
}
