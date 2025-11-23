import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ArticleCard.css';

const ArticleCard = ({ article }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="article-card">
      {article.featuredImage && (
        <div className="article-image">
          <img
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            loading="lazy"
          />
        </div>
      )}
      <div className="article-content">
        <div className="article-meta">
          <span className="category">{article.category}</span>
          <span className="date">{formatDate(article.publishedAt)}</span>
        </div>
        <h2 className="article-title">
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="article-excerpt">{article.excerpt}</p>
        <div className="article-footer">
          <div className="article-info">
            <span className="author">Par {article.author}</span>
            <span className="reading-time">📖 {article.readingTime} min de lecture</span>
          </div>
          <Link to={`/article/${article.slug}`} className="read-more">
            Lire la suite →
          </Link>
        </div>
        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;
