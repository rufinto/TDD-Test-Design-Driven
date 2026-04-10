# Cas pratique 4 - k6 Tests de Performance Taiga

Suite de tests de performance pour l'API de gestion de projet Taiga, construite avec [k6](https://k6.io/).
Les tests couvrent le cycle de vie complet d'une issue : consultation, recherche, création, mise à jour et suppression.

---

## Structure du projet

```
k6-exo/
├── config.json           # Configuration des environnements (local / prod)
├── data/
│   └── issues.json       # Données de test pour la création d'issues
├── modules/
│   ├── auth.js           # Flux de connexion et déconnexion
│   ├── contex.js         # Initialisation du contexte projet
│   └── issues.js         # Opérations CRUD sur les issues
├── scripts/
│   ├── smoke-test.js     # Smoke test (1 VU, 30s)
│   ├── load-test.js      # Load test (multi-scénarios, 10m)
│   ├── stress-test.js    # Stress test (montée en charge, ~23m)
│   └── soak-test.js      # Soak test (charge nominale, 8h)
└── utils/
    ├── config.js          # Lecture de config.json et export des constantes
    └── helpers.js         # Utilitaires partagés (données de test, pause aléatoire)
```

---

## Prérequis

- [k6](https://k6.io/docs/get-started/installation/) installé
- Une instance Taiga en cours d'exécution
- Des identifiants valides dans `config.json`

---

## Configuration

Modifier `config.json` pour définir votre environnement :

```json
{
	"local": {
		"baseUrl": "http://localhost:9000",
		"username": "votre_utilisateur",
		"password": "votre_mot_de_passe",
		"email": "votre_email@exemple.com",
		"project": "Nom du projet",
		"projectSlug": "slug-du-projet"
	}
}
```

Par défaut, les tests s'exécutent sur l'environnement `local`. Pour cibler un autre environnement, utiliser la variable `TARGET_ENV` :

```bash
k6 run scripts/smoke-test.js
```

---

## Types de tests

### Smoke Test — vérifier que le script fonctionne

- **1 VU**, 30 secondes
- Exécute le parcours complet une seule fois : connexion → consultation → création → recherche → mise à jour → suppression → déconnexion
- Seuil : 99% des requêtes sous 1500ms

```bash
k6 run scripts/smoke-test.js
```

---

### Load Test — valider sous charge nominale

- **4 scénarios en parallèle** pendant 10 minutes :
  - 75 VUs recherchant des issues
  - 15 VUs créant des issues
  - 10 VUs mettant à jour des issues
  - 10 VUs supprimant des issues
- Utilise un token partagé via `setup()` pour réduire la charge d'authentification
- Seuils : p95 < 2s (recherche), p95 < 5s (opérations d'écriture), taux d'erreur < 1%

```bash
k6 run scripts/load-test.js
```

---

### Stress Test — trouver le point de rupture

- Augmente progressivement la charge : **100 → 200 → 300 VUs** par paliers
- Chaque palier est maintenu 5 minutes avant la montée suivante
- Seuils : p95 < 5s, taux d'erreur < 5%

```bash
k6 run scripts/stress-test.js
```

Détail des paliers :

| Palier   | Durée | VUs cibles |
| -------- | ----- | ---------- |
| Montée   | 2m    | 100        |
| Maintien | 5m    | 100        |
| Montée   | 2m    | 200        |
| Maintien | 5m    | 200        |
| Montée   | 2m    | 300        |
| Maintien | 5m    | 300        |
| Descente | 2m    | 0          |

---

### Soak Test — détecter les fuites mémoire

- Maintient **40 VUs** pendant 8 heures pour révéler une dégradation progressive
- Seuils stricts : p95 < 500ms, taux d'erreur < 1%

```bash
k6 run scripts/soak-test.js
```

---

## Fonctionnement

Chaque itération suit le même parcours utilisateur :

```
login()
  └── initProject(token)
        └── viewIssues(token, projectId)
              ├── searchIssue(token, projectId, query)   [scénario recherche]
              ├── createIssue(token, projectId, data)    [scénario création]
              ├── updateIssue(token, issueId)            [scénario mise à jour]
              └── deleteIssue(token, issueId)            [scénario suppression]
logout()
sleep(0–3s)
```

**Modules :**

- `auth.js` — gère l'authentification via `/api/v1/auth` et le flux de déconnexion
- `contex.js` — initialise le contexte projet (chargement du tableau de bord, résolution du `projectId` par slug)
- `issues.js` — implémente toutes les opérations sur les issues via `/api/v1/issues`

**Données de test** (`data/issues.json`) : plusieurs objets issue prédéfinis. Chaque VU les parcourt en boucle via `__ITER % length` pour varier les données entre les itérations.

---

## Récapitulatif des seuils

| Test             | Métrique                | Seuil    |
| ---------------- | ----------------------- | -------- |
| Smoke            | `http_req_duration` p99 | < 1500ms |
| Load (recherche) | `http_req_duration` p95 | < 2000ms |
| Load (écriture)  | `http_req_duration` p95 | < 5000ms |
| Load / Soak      | `http_req_failed` rate  | < 1%     |
| Stress           | `http_req_duration` p95 | < 5000ms |
| Stress           | `http_req_failed` rate  | < 5%     |
| Soak             | `http_req_duration` p95 | < 500ms  |
| Soak             | `http_req_failed` rate  | < 1%     |
