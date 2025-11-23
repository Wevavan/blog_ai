const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis']
  },
  excerpt: {
    type: String,
    required: [true, 'L\'extrait est requis'],
    maxlength: [300, 'L\'extrait ne peut pas dépasser 300 caractères']
  },
  author: {
    type: String,
    required: [true, 'L\'auteur est requis'],
    default: 'IA Blog Team'
  },
  category: {
    type: String,
    enum: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'IA Générale', 'Éthique IA', 'Actualités'],
    default: 'IA Générale'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    type: String,
    default: ''
  },
  imageAlt: {
    type: String,
    default: ''
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'La meta description ne peut pas dépasser 160 caractères']
  },
  metaKeywords: [{
    type: String
  }],
  readingTime: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
articleSchema.index({ slug: 1 });
articleSchema.index({ published: 1, publishedAt: -1 });
articleSchema.index({ category: 1 });
articleSchema.index({ tags: 1 });

// Méthode pour générer le slug à partir du titre
articleSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Calculer le temps de lecture
articleSchema.pre('save', function(next) {
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }

  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

module.exports = mongoose.model('Article', articleSchema);
