# Stock MR - Gestion de Véhicules

Application web complète de gestion de stock de véhicules et de factures, avec interface d'administration pour la personnalisation totale sans code.

## Fonctionnalités

### 📊 Gestion du Stock
- Ajouter, modifier, supprimer des véhicules
- Suivre le statut des véhicules (En stock, Vendu, En réparation)
- Afficher les détails complets avec factures associées
- Importer des véhicules via CSV
- Calcul automatique des profits/pertes

### 📑 Gestion des Factures
- Créer des factures liées aux véhicules
- Suivi des réparations et interventions
- Types de factures personnalisables
- Importer des factures via CSV

### ⚙️ Panneau d'Administration Complet

#### 1. **Gestion des Champs Personnalisés**
- Ajouter des champs personnalisés aux véhicules
- Ajouter des champs personnalisés aux factures
- Les champs apparaissent automatiquement dans les formulaires et tableaux

#### 2. **Gestion des Listes Déroulantes**
- Personnaliser les statuts des véhicules
- Personnaliser les types de factures
- Ajouter/supprimer des options dynamiquement

#### 3. **Gestion des Fournisseurs**
- Liste complète des fournisseurs
- Ajouter/supprimer des fournisseurs
- Stocker les coordonnées de contact

#### 4. **Gestion des Accès**
- Générer des codes d'accès uniques
- Contrôler qui peut accéder à l'application
- Révoquer les accès à tout moment

#### 5. **Configuration Visuelle**
- Personnaliser le nom de l'entreprise
- Changer le logo
- Modifier les couleurs primaires et secondaires
- Choisir la devise

### 🔐 Système d'Authentification
- Page de connexion par code d'accès
- Codes uniques générés par l'administrateur
- Stockage sécurisé dans Firestore

## Architecture

- **Frontend** : HTML5, CSS3, JavaScript vanilla
- **Backend** : Firebase Firestore
- **Authentification** : Codes d'accès personnalisés
- **Stockage** : Collections Firestore (vehicles, invoices, customFields, dropdownOptions, suppliers, accessCodes, config)

## Installation

1. Cloner le repository
```bash
git clone https://github.com/stockmr2025/megastockmr.git
cd megastockmr
```

2. Ouvrir `index.html` dans un navigateur web

3. Entrer un code d'accès (généré par l'administrateur)

## Configuration Firebase

La configuration Firebase est déjà intégrée dans `app.js`. Aucune configuration supplémentaire n'est nécessaire.

## Utilisation

### Pour l'Administrateur (Evelyne)

1. **Accéder à l'onglet Admin** pour :
   - Gérer les champs personnalisés
   - Modifier les listes déroulantes
   - Gérer les fournisseurs
   - Générer des codes d'accès pour les utilisateurs
   - Personnaliser l'apparence de l'application

2. **Générer des codes d'accès** :
   - Aller à "Gestion des Accès"
   - Cliquer sur "Générer un Nouveau Code"
   - Partager le code avec l'utilisateur

### Pour les Utilisateurs

1. Entrer le code d'accès fourni par l'administrateur
2. Accéder à l'application
3. Utiliser les onglets Stock et Factures selon les besoins
4. Se déconnecter en cliquant sur "Déconnexion"

## Fichiers Principaux

- `index.html` - Structure HTML de l'application
- `app.js` - Logique principale et gestion Firestore
- `app-enhanced.js` - Intégration des champs dynamiques
- `auth.js` - Système d'authentification
- `config.js` - Configuration visuelle
- `style.css` - Styles et thème
- `firebase.js` - Configuration Firebase (compatibilité)

## Déploiement

L'application est déployée sur : https://stockmr.manus.space

## Support

Pour toute question ou problème, contactez l'administrateur.

## Licence

Propriétaire : Stock MR
