# Cas pratique 3 - Tests Playwright Taiga

Ce dossier contient un projet de tests automatisés Playwright pour l'application Taiga.

## Ce que fait le projet

- utilise `@playwright/test` pour lancer des tests de navigateur
- contient des objets de page (`pages/`) pour structurer les actions
- exécute un scénario principal dans `tests/taiga.spec.ts` qui :
  1. ouvre la page de connexion Taiga
  2. se connecte avec un compte utilisateur
  3. accède directement au projet via son `slug`
  4. ouvre la page des issues
  5. crée une nouvelle issue avec un sujet, une description, un type, une sévérité et une priorité

Le projet inclut aussi un exemple de test Playwright simple dans `tests/example.spec.ts`.

## Structure du dossier

- `package.json` : dépendances du projet
- `playwright.config.ts` : configuration Playwright
- `pages/` : objets de page pour `LoginPage`, `DashboardPage` et `IssuesPage`
- `tests/` : cas de test Playwright
- `utils/test-data.ts` : données de test partagées (URL, identifiants, slug de projet)

## Prérequis

- Node.js installé
- Accès Internet pour atteindre `https://tree.taiga.io`
- Compte Taiga valide correspondant aux identifiants dans `utils/test-data.ts`

## Installation

1. Ouvrir un terminal dans `cas_pratique_3`
2. Installer les dépendances :

```bash
npm install
```

## Lancer les tests

Depuis `cas_pratique_3` :

```bash
npx playwright test
```

## Notes

- Le navigateur s'ouvre en mode non-headless (`headless: false`) pour suivre le déroulement des actions.
- Les tests créent une issue dans le projet Taiga spécifié par `PROJECT_SLUG`.
- Si nécessaire, adaptez les identifiants ou l'URL dans `utils/test-data.ts`.
