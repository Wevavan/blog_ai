# 🤖 IA Blog - Blog sur l'Intelligence Artificielle

Un blog moderne et optimisé SEO dédié à l'intelligence artificielle, au machine learning et aux dernières innovations en IA.

## 📋 Fonctionnalités

### Blog
- ✅ Affichage des articles avec pagination
- ✅ Page de détail d'article avec compteur de vues
- ✅ Catégorisation des articles (Machine Learning, Deep Learning, NLP, Computer Vision, etc.)
- ✅ Système de tags
- ✅ Temps de lecture estimé
- ✅ Recherche d'articles
- ✅ Design responsive et moderne

### Optimisations SEO
- ✅ Meta tags dynamiques (title, description, keywords)
- ✅ Open Graph pour les réseaux sociaux (Facebook, Twitter)
- ✅ Schema.org markup (Article, Website, Breadcrumb)
- ✅ URLs SEO-friendly (slugs)
- ✅ Sitemap XML et robots.txt
- ✅ React Helmet pour la gestion des meta tags
- ✅ Images optimisées avec lazy loading

### API Backend
- ✅ API REST complète pour les articles
- ✅ Pagination et filtrage
- ✅ Recherche full-text
- ✅ Statistiques par catégorie
- ✅ Validation des données
- ✅ Gestion d'erreurs robuste

## 🛠️ Technologies Utilisées

### Frontend
- **React** 18.2.0 - Framework UI
- **React Router** 6.21.1 - Navigation
- **React Helmet Async** 2.0.4 - Gestion SEO
- **Axios** 1.6.5 - Requêtes HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express** 4.18.2 - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** 8.0.3 - ODM MongoDB

### Sécurité & Performance
- **Helmet** - Sécurité HTTP headers
- **CORS** - Gestion des requêtes cross-origin
- **Compression** - Compression des réponses
- **Express Validator** - Validation des données

## 📦 Installation

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (v4.4 ou supérieur)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd blog_ai
```

### 2. Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos configurations
# MONGODB_URI=mongodb://localhost:27017/blog-ai
# JWT_SECRET=votre_secret_securise
# PORT=5000
# FRONTEND_URL=http://localhost:3000
```

### 3. Configuration du Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos configurations
# REACT_APP_API_URL=http://localhost:5000/api
# REACT_APP_SITE_NAME=IA Blog
# REACT_APP_SITE_URL=http://localhost:3000
```

### 4. Démarrer MongoDB

```bash
# Si MongoDB n'est pas déjà en cours d'exécution
mongod
```

### 5. Lancer l'application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Le serveur démarre sur http://localhost:5000

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
L'application démarre sur http://localhost:3000

## 📚 Structure du Projet

```
blog_ai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Configuration MongoDB
│   │   ├── models/
│   │   │   └── Article.js           # Modèle Article
│   │   ├── controllers/
│   │   │   └── articleController.js # Contrôleurs articles
│   │   ├── routes/
│   │   │   └── articles.js          # Routes API articles
│   │   └── server.js                # Point d'entrée serveur
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   ├── robots.txt
    │   └── manifest.json
    ├── src/
    │   ├── components/
    │   │   ├── Header.js            # En-tête navigation
    │   │   ├── Footer.js            # Pied de page
    │   │   ├── ArticleCard.js       # Carte article
    │   │   └── SEO.js               # Composant SEO
    │   ├── pages/
    │   │   ├── Home.js              # Page d'accueil
    │   │   ├── ArticleDetail.js     # Détail article
    │   │   └── Categories.js        # Page catégories
    │   ├── services/
    │   │   └── api.js               # Service API
    │   ├── utils/
    │   │   └── seo.js               # Utilitaires SEO
    │   ├── styles/                  # Fichiers CSS
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env.example
```

## 🔌 API Endpoints

### Articles

#### GET /api/articles
Récupère tous les articles publiés
- Query params: `page`, `limit`, `category`, `tag`
- Réponse: Liste paginée d'articles

#### GET /api/articles/:slug
Récupère un article par son slug
- Réponse: Article complet avec incrémentation des vues

#### POST /api/articles
Crée un nouvel article
- Body: Données de l'article
- Validation: title, content, excerpt requis

#### PUT /api/articles/:id
Met à jour un article
- Body: Données à mettre à jour

#### DELETE /api/articles/:id
Supprime un article

#### GET /api/articles/search
Recherche d'articles
- Query params: `q` (terme de recherche)

#### GET /api/articles/stats/categories
Statistiques par catégorie
- Réponse: Nombre d'articles par catégorie

## 🎨 Personnalisation

### Ajouter une nouvelle catégorie

1. Modifier le modèle Article (`backend/src/models/Article.js`)
```javascript
category: {
  type: String,
  enum: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'IA Générale', 'Éthique IA', 'Actualités', 'NOUVELLE_CATEGORIE'],
  default: 'IA Générale'
}
```

2. Ajouter la description dans `frontend/src/pages/Categories.js`
```javascript
const categoryDescriptions = {
  'NOUVELLE_CATEGORIE': 'Description de la nouvelle catégorie'
};
```

### Modifier le thème

Éditer les variables CSS dans `frontend/src/styles/index.css`:
```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  /* ... autres variables */
}
```

## 🚀 Prochaines Étapes

Pour la phase 2, nous créerons un outil d'administration permettant de :
- ✨ Générer automatiquement des articles avec l'IA
- ✏️ Éditer et prévisualiser les articles
- ✅ Valider et publier les articles
- 📊 Tableau de bord avec statistiques
- 🔐 Authentification et gestion des utilisateurs

## 📝 Création d'un Article (Exemple)

Pour créer un article via l'API:

```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction au Machine Learning",
    "content": "<p>Le machine learning est...</p>",
    "excerpt": "Découvrez les bases du machine learning",
    "category": "Machine Learning",
    "tags": ["ML", "IA", "Apprentissage"],
    "author": "IA Blog Team",
    "published": true,
    "metaDescription": "Guide complet sur le machine learning"
  }'
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## 📄 Licence

MIT

## 👥 Auteur

IA Blog Team

---

**Note**: Ce projet est la première phase d'une plateforme complète de blogging avec génération de contenu par IA. La phase 2 inclura l'outil de création automatique d'articles.
