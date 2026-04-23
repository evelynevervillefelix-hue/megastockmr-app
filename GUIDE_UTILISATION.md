# 📖 Guide d'Utilisation - Stock MR

Bienvenue dans Stock MR ! Ce guide vous aidera à utiliser l'application pour gérer votre stock de véhicules et vos factures.

## 🔐 Connexion

1. Ouvrez l'application
2. Vous verrez une page de connexion avec un champ "Code d'accès"
3. Entrez le code d'accès fourni par l'administrateur
4. Cliquez sur "Accéder à l'application"

**Note** : Si vous êtes l'administrateur (Evelyne), vous pouvez générer des codes d'accès dans l'onglet Admin.

## 📊 Onglet Stock

Cet onglet vous permet de gérer votre stock de véhicules.

### Ajouter un Véhicule

1. Cliquez sur "➕ Ajouter Véhicule"
2. Remplissez le formulaire :
   - **MR** : Numéro de référence unique
   - **Marque** : Marque du véhicule (ex: Toyota, Ford)
   - **Modèle** : Modèle du véhicule
   - **Année** : Année de fabrication
   - **Coût (CAD)** : Prix d'achat
   - **Statut** : En stock, Vendu, En réparation
   - **Prix de vente (CAD)** : Prix de vente (si applicable)
3. Cliquez sur "Enregistrer"

### Modifier un Véhicule

1. Trouvez le véhicule dans le tableau
2. Cliquez sur le bouton ✏️ (Modifier)
3. Modifiez les informations
4. Cliquez sur "Enregistrer"

### Supprimer un Véhicule

1. Trouvez le véhicule dans le tableau
2. Cliquez sur le bouton 🗑️ (Supprimer)
3. Confirmez la suppression

### Voir les Détails

1. Trouvez le véhicule dans le tableau
2. Cliquez sur le bouton 👁️ (Détails)
3. Vous verrez :
   - Toutes les informations du véhicule
   - Les factures associées
   - Le calcul du profit/perte

### Importer des Véhicules

1. Cliquez sur "📥 Importer CSV"
2. Sélectionnez un fichier CSV avec les colonnes : MR, Marque, Modèle, Année, Coût, Statut, Prix de vente
3. Les véhicules seront importés automatiquement

## 📑 Onglet Factures

Cet onglet vous permet de gérer les factures liées aux véhicules.

### Ajouter une Facture

1. Cliquez sur "➕ Ajouter Facture"
2. Remplissez le formulaire :
   - **MR Véhicule** : Sélectionnez le véhicule concerné
   - **Type** : Type de facture (Mécanique, Carrosserie, Pneus, Autre)
   - **Date** : Date de la facture
   - **Description** : Description du travail effectué
   - **Montant (CAD)** : Montant de la facture
3. Cliquez sur "Enregistrer"

### Modifier une Facture

1. Trouvez la facture dans le tableau
2. Cliquez sur le bouton ✏️ (Modifier)
3. Modifiez les informations
4. Cliquez sur "Enregistrer"

### Supprimer une Facture

1. Trouvez la facture dans le tableau
2. Cliquez sur le bouton 🗑️ (Supprimer)
3. Confirmez la suppression

### Importer des Factures

1. Cliquez sur "📥 Importer CSV"
2. Sélectionnez un fichier CSV avec les colonnes : MR, Type, Date, Description, Montant
3. Les factures seront importées automatiquement

## ⚙️ Onglet Admin (Administrateur Uniquement)

Cet onglet vous permet de personnaliser complètement l'application sans toucher au code.

### 📊 Statistiques

Vous verrez les statistiques globales :
- Total de véhicules
- Véhicules vendus
- Véhicules en stock
- Valeur totale d'achat
- Total des factures
- Total des ventes

### 📋 Gestion des Champs Personnalisés

Vous pouvez ajouter des champs personnalisés aux véhicules et aux factures.

**Pour les véhicules** :
1. Entrez le nom du champ (ex: "Kilométrage", "Couleur")
2. Cliquez sur "➕ Ajouter"
3. Le champ apparaîtra automatiquement dans le formulaire d'ajout/édition

**Pour les factures** :
1. Entrez le nom du champ (ex: "Numéro de facture", "Fournisseur")
2. Cliquez sur "➕ Ajouter"
3. Le champ apparaîtra automatiquement dans le formulaire d'ajout/édition

### 📑 Gestion des Listes Déroulantes

Vous pouvez personnaliser les options des menus déroulants.

**Statuts des Véhicules** :
1. Entrez un nouveau statut (ex: "Réservé", "En attente")
2. Cliquez sur "➕ Ajouter"
3. Le statut apparaîtra dans le menu déroulant

**Types de Factures** :
1. Entrez un nouveau type (ex: "Assurance", "Immatriculation")
2. Cliquez sur "➕ Ajouter"
3. Le type apparaîtra dans le menu déroulant

### 🏢 Gestion des Fournisseurs

Vous pouvez gérer une liste de fournisseurs.

1. Entrez le nom du fournisseur
2. Entrez le contact (téléphone, email)
3. Cliquez sur "➕ Ajouter Fournisseur"

Pour supprimer un fournisseur, cliquez sur le bouton 🗑️.

### 🔐 Gestion des Accès

Vous pouvez contrôler qui peut accéder à l'application.

**Générer un Code d'Accès** :
1. Cliquez sur "🔑 Générer un Nouveau Code"
2. Un code unique sera généré (ex: MRXYZ123ABC)
3. Partagez ce code avec l'utilisateur
4. L'utilisateur pourra l'utiliser pour accéder à l'application

**Révoquer un Accès** :
1. Trouvez le code dans la liste
2. Cliquez sur le bouton 🗑️
3. L'accès sera révoqué immédiatement

### 🎨 Configuration Visuelle

Vous pouvez personnaliser l'apparence de l'application.

1. **Nom de l'entreprise** : Changez le nom affiché
2. **URL du logo** : Entrez le chemin du logo
3. **Couleur primaire** : Choisissez la couleur rouge (boutons, accents)
4. **Couleur secondaire** : Choisissez la couleur gris/noir
5. **Devise** : Sélectionnez la devise (CAD, USD, EUR)
6. Cliquez sur "💾 Enregistrer la configuration"

## 💡 Conseils Utiles

- **Rafraîchir les données** : Cliquez sur "🔄 Rafraîchir" dans l'onglet Stock
- **Rechercher** : Utilisez Ctrl+F pour chercher dans le tableau
- **Exporter** : Vous pouvez copier les tableaux et les coller dans Excel
- **Sauvegarde** : Toutes les données sont sauvegardées automatiquement dans Firestore

## 🆘 Dépannage

**Je ne peux pas me connecter**
- Vérifiez que vous avez entré le bon code d'accès
- Vérifiez que le code n'a pas été révoqué
- Contactez l'administrateur pour un nouveau code

**Un champ personnalisé n'apparaît pas**
- Rafraîchissez la page (F5)
- Fermez et rouvrez le formulaire

**Les données ne se sauvegardent pas**
- Vérifiez votre connexion Internet
- Vérifiez que Firebase est accessible
- Consultez la console du navigateur (F12) pour les erreurs

## 📞 Support

Pour toute question ou problème, contactez l'administrateur ou consultez le README.md.

---

**Version** : 1.0.0
**Dernière mise à jour** : Avril 2026
