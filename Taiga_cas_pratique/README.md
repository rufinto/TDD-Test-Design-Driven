## 🧱 Structure de la collection Bruno

La collection est composée des requêtes suivantes :

###  Authentification
- **01_Login**  
  Permet de récupérer un `auth_token` utilisé pour toutes les requêtes suivantes.

---

###  Gestion du projet
- **02_Get_Project_by_Slug**  
  Récupère les informations du projet à partir de son `slug`.

---

###  Gestion des issues
- **05_Get_Issues**  
  Récupère la liste des anomalies (issues) du projet.

- **06_Create_Issue**  
  Crée une nouvelle anomalie.

- **07_Get_Issue_By_Id**  
  Récupère les informations d’une issue spécifique.

- **08_Update_Issue_Status**  
  Modifie le statut d’une issue existante.

---

###  Automatisation via fichier externe
- **09_Get_Local_Issue_Data**  
  Lit une entrée depuis un fichier JSON exposé via un serveur local (`json-server`).

- **10_Create_Issue_From_JSON**  
  Crée une issue dans Taiga à partir des données récupérées localement.

---

## Logique de fonctionnement (étape 9)

### Source de données

Un fichier `issues.json` contient les données des anomalies :

[
  {
    "subject": "Bug login",
    "description": "Erreur lors de la connexion"
  }
]

### Source de données

Ce fichier est exposé via un serveur local :

```bash
npx json-server --watch issues.json --port 3000

### Boucle d’exécution

La boucle repose sur deux variables :

index : position actuelle dans le fichier
count : nombre total d’éléments
Étapes :

#09_Get_Local_Issue_Data

récupère les données via :

http://localhost:3000/{{index}}
stocke :
csv_subject
csv_description

#10_Create_Issue_From_JSON

crée une issue avec ces données
incrémente index

relance la requête 09 tant que :

index < count - 1