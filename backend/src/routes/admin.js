const express = require('express');
const router = express.Router();
const {
  generateArticle,
  createArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
  getStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes sont protégées
router.use(protect);

// Stats - Admin et Editor
router.get('/stats', authorize('admin', 'editor'), getStats);

// Génération d'article avec IA - Admin et Editor
router.post('/generate', authorize('admin', 'editor', 'author'), generateArticle);

// CRUD Articles - Admin, Editor, Author
router.route('/articles')
  .get(authorize('admin', 'editor'), getAllArticles)
  .post(authorize('admin', 'editor', 'author'), createArticle);

router.route('/articles/:id')
  .put(authorize('admin', 'editor', 'author'), updateArticle)
  .delete(authorize('admin'), deleteArticle);

module.exports = router;
