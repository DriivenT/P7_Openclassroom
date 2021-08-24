# Projet

Projet 7 du parcours Web d'Openclassrooms
Par Tom BRETINIERE

## Commencement

Les instructions pour lancer le projet sur votre ordinateur local

### Prérequis

Pour installer ce projet veuillez vous procurer :

```
Node.js
MySQL
Vue.js
```

### Installation

1. Cloner le repo
2. Lancer ```npm install```
3. Configurer ```config/config.json```
4. Lancer ```sequelize db:create && sequelize db:migrate```
5. Importer database_development.sql
6. Créer un fichier ".env" à la racine pour l'utilisation de "dotenv" contenant ceci:
    - HOST = localhost
    - PORT = 3307
    - USER = admin
    - PASSWORD = admin
    - DB = groupomania
    - HEADERS = *
    - TOKEN_SECRET = 'clé_très_secrète_9838950°9837748_Personne_ne_la_connait'
7. Enjoy

### Compétences  
  
- Personnaliser le contenu envoyé à un client web  
- Authentifier un utilisateur et maintenir sa session  
- Gérer un stockage de données à l'aide de SQL  
- Implémenter un stockage de données sécurisé en utilisant SQL
