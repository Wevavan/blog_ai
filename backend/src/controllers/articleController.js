const Article = require('../models/Article');
const { validationResult } = require('express-validator');

// @desc    Obtenir tous les articles publiés
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag } = req.query;

    const query = { published: true };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content');

    const count = await Article.countDocuments(query);

    res.json({
      success: true,
      data: articles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des articles',
      error: error.message
    });
  }
};

// @desc    Obtenir un article par son slug
// @route   GET /api/articles/:slug
// @access  Public
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      published: true
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    // Incrémenter les vues
    article.views += 1;
    await article.save();

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'article',
      error: error.message
    });
  }
};

// @desc    Créer un nouvel article
// @route   POST /api/articles
// @access  Private (sera ajouté plus tard)
exports.createArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const article = await Article.create(req.body);

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Un article avec ce slug existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'article',
      error: error.message
    });
  }
};

// @desc    Mettre à jour un article
// @route   PUT /api/articles/:id
// @access  Private
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: updatedArticle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'article',
      error: error.message
    });
  }
};

// @desc    Supprimer un article
// @route   DELETE /api/articles/:id
// @access  Private
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    await article.deleteOne();

    res.json({
      success: true,
      message: 'Article supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'article',
      error: error.message
    });
  }
};

// @desc    Obtenir les catégories avec le nombre d'articles
// @route   GET /api/articles/stats/categories
// @access  Public
exports.getCategoriesStats = async (req, res) => {
  try {
    const stats = await Article.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// @desc    Rechercher des articles
// @route   GET /api/articles/search
// @access  Public
exports.searchArticles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un terme de recherche'
      });
    }

    const articles = await Article.find({
      published: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    })
      .select('-content')
      .limit(20);

    res.json({
      success: true,
      data: articles,
      count: articles.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche',
      error: error.message
    });
  }
};
