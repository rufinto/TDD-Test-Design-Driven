# Cas pratique 3 - Playwright Taiga

Ce dossier contient un projet de tests automatisés Playwright pour l'application Taiga.

## Objectif

Le test principal (`tests/taiga.spec.ts`) effectue les actions suivantes :
1. ouvrir la page de connexion Taiga
2. se connecter avec un compte utilisateur
3. accéder au projet via son `slug`
4. ouvrir la page des issues
5. créer une nouvelle issue

## Structure du dossier

- `package.json` : dépendances et scripts
- `playwright.config.ts` : configuration Playwright
- `pages/` : classes de page pour les actions Web
- `tests/` : cas de test Playwright
- `utils/test-data.ts` : lecture des variables d'environnement
- `.env.example` : modèle pour les paramètres secrets

## Étapes pour lancer le projet

1. Ouvrir un terminal dans `cas_pratique_3`
2. Installer les dépendances :

```bash
npm install
```

3. Créer le fichier `.env` à partir du modèle :

```bash
copy .env.example .env
```

4. Ouvrir `.env` et modifier :

```ini
TAIGA_USERNAME=your_taiga_username
TAIGA_PASSWORD=your_taiga_password
```

5. Lancer les tests :

```bash
npx playwright test
```

## Exemple de `.env`

```ini
TAIGA_BASE_URL=https://tree.taiga.io
TAIGA_PROJECT_NAME=Projet-TDD
TAIGA_PROJECT_SLUG=abdelaziztaiga-projet-tdd
TAIGA_USERNAME=votre_nom_d_utilisateur
TAIGA_PASSWORD=votre_mot_de_passe
```

## Remarques

- Le test utilise `.env` pour charger les identifiants Taiga.
- Le navigateur est lancé en mode visible (`headless: false`) pour observer l'exécution.
- Si vous modifiez le projet ou l'URL, adaptez les valeurs dans `.env`.
