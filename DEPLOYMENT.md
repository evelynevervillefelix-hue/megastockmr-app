# 🚀 Déploiement de Stock MR

## URL de Déploiement

L'application est actuellement déployée sur :
**https://9000-i9jmel08qgz2wliq4v25e-60ded7c8.us2.manus.computer**

Pour déployer sur le domaine final `https://stockmr.manus.space`, veuillez utiliser l'une des méthodes suivantes :

## Méthode 1 : Déploiement Manus CLI

```bash
manus deploy /home/ubuntu/stockmr-deploy --domain stockmr.manus.space
```

## Méthode 2 : Copie vers serveur web

Copiez tous les fichiers du répertoire `/home/ubuntu/stockmr-deploy` vers votre serveur web :

```bash
scp -r /home/ubuntu/stockmr-deploy/* user@your-server:/var/www/stockmr/
```

## Méthode 3 : Déploiement Docker

Créez un Dockerfile :

```dockerfile
FROM nginx:alpine
COPY /home/ubuntu/stockmr-deploy /usr/share/nginx/html
EXPOSE 80
```

Puis déployez :

```bash
docker build -t stockmr .
docker run -p 80:80 stockmr
```

## Fichiers Inclus

- `index.html` - Page principale
- `style.css` - Styles et thème
- `app.js` - Logique principale (34 KB)
- `app-enhanced.js` - Intégration des champs dynamiques (16 KB)
- `auth.js` - Système d'authentification (6 KB)
- `config.js` - Configuration visuelle (7 KB)
- `firebase.js` - Configuration Firebase
- `mr_auto_logo.svg` - Logo de l'application
- `README.md` - Documentation
- `manus.json` - Configuration Manus

## Taille Totale

L'application fait environ **108 KB** (sans compression).

## Configuration Firebase

La configuration Firebase est déjà intégrée dans `app.js`. Aucune modification n'est nécessaire.

## Authentification

L'application utilise un système de codes d'accès. Pour accéder :

1. Un administrateur génère un code d'accès depuis l'onglet Admin
2. L'utilisateur entre le code sur la page de connexion
3. L'accès est accordé et stocké dans Firestore

## Support

Pour toute question, consultez le README.md ou contactez l'administrateur.
