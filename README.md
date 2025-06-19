# Gestionnaire de Tâches Sportives 🏋️‍♂️

## 📌 Description  
Cette application est un gestionnaire de tâches orienté sport. Elle permet aux utilisateurs de suivre leurs séances, enregistrer leurs exercices, et consulter leur historique. L’application inclut un système d’authentification sécurisé, une interface dynamique rendue côté serveur avec Handlebars, et une base de données MongoDB.

## 🚀 Fonctionnalités
- **Inscription et connexion sécurisées** avec hashage des mots de passe
- **Ajout d’exercices** avec type, description, durée, distance et calories
- **Modification / suppression** des exercices existants
- **Statut d’achèvement** (complété / non complété)
- **Réinitialisation du mot de passe par email**
- **Pages d’erreur personnalisées** (404 & 500)
- **Interface responsive** avec Bootstrap
- **Affichage dynamique des messages (flash)** pour le feedback utilisateur

## 🛠️ Technologies utilisées
- **Node.js & Express** : Backend et serveur
- **MongoDB & Mongoose** : Base de données
- **Handlebars** : Moteur de templates côté serveur
- **Bootstrap** : Design responsive
- **Express-session & connect-flash** : Authentification et messages temporaires
- **bcrypt** : Hashage sécurisé des mots de passe
- **Nodemailer** : Envoi d’e-mails pour réinitialisation

## 📦 Prérequis
- Node.js (v14 ou supérieur)
- MongoDB local ou MongoDB Atlas
- Compte email (si envoi réel des liens de réinitialisation)

## ⚙️ Installation

```bash
git clone https://github.com/melkash/gestionnaire-de-taches.git
cd gestionnaire-de-taches
npm install
```
## 📁 Configuration (.env)

Crée un fichier `.env` à la racine avec les variables suivantes :

```env
MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_session_secret
NODE_ENV=development
```
