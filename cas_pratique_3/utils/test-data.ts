import dotenv from 'dotenv';

dotenv.config();

function envOrFail(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable ${key}. Add it to .env or export it before running tests.`);
  }
  return value;
}

export const BASE_URL = process.env.TAIGA_BASE_URL ?? 'https://tree.taiga.io';
export const PROJECT_NAME = process.env.TAIGA_PROJECT_NAME ?? 'Projet-TDD';
export const PROJECT_SLUG = process.env.TAIGA_PROJECT_SLUG ?? 'abdelaziztaiga-projet-tdd';
export const USERNAME = envOrFail('TAIGA_USERNAME');
export const PASSWORD = envOrFail('TAIGA_PASSWORD')