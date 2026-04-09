const config = JSON.parse(open('../config.json'));
const env = __ENV.TARGET_ENV || 'local';
const settings = config[env];
//console.log(`Running tests against environment: ${env}`);
// console.log(`Host: ${settings}`);

export const HOST = settings.host;
export const BASE_URL = settings.baseUrl;
export const USERNAME = settings.username;
export const PASSWORD = settings.password;
export const EMAIL = settings.email;
export const PROJECT_NAME = settings.project;
export const PROJECT_SLUG = settings.projectSlug;
