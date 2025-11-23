const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getCategoriesStats,
  searchArticles
} = require('../controllers/articleController');

// Validation pour la création/mise à jour d'articles
const articleValidation = [
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('content').trim().notEmpty().withMessage('Le contenu est requis'),
  body('excerpt').trim().notEmpty().withMessage('L\'extrait est requis'),
  body('category').optional().isIn(['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'IA Générale', 'Éthique IA', 'Actualités'])
];

// Routes publiques
router.get('/search', searchArticles);
router.get('/stats/categories', getCategoriesStats);
router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);

// Routes protégées (authentification sera ajoutée plus tard)
router.post('/', articleValidation, createArticle);
router.put('/:id', articleValidation, updateArticle);
router.delete('/:id', deleteArticle);

module.exports = router;
