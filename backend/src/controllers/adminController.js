const Article = require('../models/Article');
const aiService = require('../services/aiService');

// @desc    Générer un article avec l'IA
// @route   POST /api/admin/generate
// @access  Private (Admin/Editor)
exports.generateArticle = async (req, res) => {
  try {
    const { topic, category, tone, length } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Le sujet est requis'
      });
    }

    // Générer l'article avec l'IA
    const generatedContent = await aiService.generateArticle(topic, {
      category,
      tone,
      length
    });

    // Convertir le Markdown en HTML (simple conversion)
    const htmlContent = convertMarkdownToHTML(generatedContent.content);

    res.json({
      success: true,
      data: {
        ...generatedContent,
        htmlContent,
        category: category || 'IA Générale',
        author: req.user.username
      }
    });
  } catch (error) {
    console.error('Erreur génération:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération de l\'article',
      error: error.message
    });
  }
};

// @desc    Créer et publier un article
// @route   POST /api/admin/articles
// @access  Private (Admin/Editor/Author)
exports.createArticle = async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      author: req.user.username
    };

    const article = await Article.create(articleData);

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'article',
      error: error.message
    });
  }
};

// @desc    Obtenir tous les articles (y compris non publiés)
// @route   GET /api/admin/articles
// @access  Private (Admin/Editor)
exports.getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 20, published } = req.query;

    const query = {};
    if (published !== undefined) {
      query.published = published === 'true';
    }

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

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

// @desc    Mettre à jour un article
// @route   PUT /api/admin/articles/:id
// @access  Private (Admin/Editor/Author)
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    res.json({
      success: true,
      data: article
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
// @route   DELETE /api/admin/articles/:id
// @access  Private (Admin)
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

// @desc    Obtenir les statistiques du dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin/Editor)
exports.getStats = async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ published: true });
    const draftArticles = await Article.countDocuments({ published: false });
    const totalViews = await Article.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    const recentArticles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt published views');

    const topArticles = await Article.find({ published: true })
      .sort({ views: -1 })
      .limit(5)
      .select('title views');

    res.json({
      success: true,
      data: {
        totalArticles,
        publishedArticles,
        draftArticles,
        totalViews: totalViews[0]?.total || 0,
        recentArticles,
        topArticles
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// Fonction helper pour convertir Markdown en HTML
function convertMarkdownToHTML(markdown) {
  if (!markdown) return '';

  let html = markdown;

  // Headers (ordre important: du plus spécifique au moins spécifique)
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold (avant italic pour éviter les conflits)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Code inline
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Lists - mieux gérer les listes
  const lines = html.split('\n');
  let inList = false;
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^[\-\*] /)) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push(line.replace(/^[\-\*] (.+)$/, '<li>$1</li>'));
    } else if (line.match(/^\d+\. /)) {
      if (!inList) {
        processedLines.push('<ol>');
        inList = true;
      }
      processedLines.push(line.replace(/^\d+\. (.+)$/, '<li>$1</li>'));
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }

  if (inList) {
    processedLines.push('</ul>');
  }

  html = processedLines.join('\n');

  // Paragraphs - séparer les blocs
  const blocks = html.split('\n\n');
  const processedBlocks = blocks.map(block => {
    block = block.trim();
    if (!block) return '';

    // Ne pas envelopper les éléments HTML existants
    if (block.startsWith('<h') ||
        block.startsWith('<ul') ||
        block.startsWith('<ol') ||
        block.startsWith('<li') ||
        block.startsWith('<blockquote')) {
      return block;
    }

    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  });

  html = processedBlocks.filter(b => b).join('\n\n');

  return html;
}

module.exports = exports;
