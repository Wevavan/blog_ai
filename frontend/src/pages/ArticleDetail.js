import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { articlesAPI } from '../services/api';
import { generateArticleSchema, generateBreadcrumbSchema } from '../utils/seo';
import '../styles/ArticleDetail.css';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await articlesAPI.getBySlug(slug);
      setArticle(data.data);
      setLoading(false);
    } catch (err) {
      setError('Article non trouvé');
      setLoading(false);
      console.error('Error fetching article:', err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement de l'article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="error-page">
        <h1>Article non trouvé</h1>
        <p>{error}</p>
        <Link to="/" className="back-link">← Retour à l'accueil</Link>
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Accueil', url: process.env.REACT_APP_SITE_URL },
    { name: article.category, url: `${process.env.REACT_APP_SITE_URL}/category/${article.category}` },
    { name: article.title, url: `${process.env.REACT_APP_SITE_URL}/article/${article.slug}` },
  ];

  return (
    <div className="article-detail">
      <SEO
        data={{
          title: `${article.title} | IA Blog`,
          description: article.metaDescription || article.excerpt,
          image: article.featuredImage,
          url: `${process.env.REACT_APP_SITE_URL}/article/${article.slug}`,
          type: 'article',
          author: article.author,
          keywords: article.metaKeywords || article.tags,
          publishedTime: article.publishedAt,
          modifiedTime: article.updatedAt,
        }}
        schema={`[${generateArticleSchema(article)},${generateBreadcrumbSchema(breadcrumbs)}]`}
      />

      <article className="article-container">
        <header className="article-header">
          <div className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="separator">/</span>
            <span className="category">{article.category}</span>
          </div>

          <h1 className="article-title">{article.title}</h1>

          <div className="article-meta">
            <span className="author">Par {article.author}</span>
            <span className="separator">•</span>
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            <span className="separator">•</span>
            <span className="reading-time">📖 {article.readingTime} min de lecture</span>
            <span className="separator">•</span>
            <span className="views">👁️ {article.views} vues</span>
          </div>

          {article.featuredImage && (
            <div className="featured-image">
              <img
                src={article.featuredImage}
                alt={article.imageAlt || article.title}
              />
            </div>
          )}
        </header>

        <div className="article-content">
          <div className="content" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {article.tags && article.tags.length > 0 && (
          <footer className="article-footer">
            <div className="tags">
              <strong>Tags:</strong>
              {article.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          </footer>
        )}
      </article>

      <div className="article-navigation">
        <Link to="/" className="back-link">← Retour aux articles</Link>
      </div>
    </div>
  );
};

export default ArticleDetail;
