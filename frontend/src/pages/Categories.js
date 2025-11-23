import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { articlesAPI } from '../services/api';
import '../styles/Categories.css';

const Categories = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoriesStats();
  }, []);

  const fetchCategoriesStats = async () => {
    try {
      const data = await articlesAPI.getCategoriesStats();
      setStats(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories stats:', err);
      setLoading(false);
    }
  };

  const categoryDescriptions = {
    'Machine Learning': 'Algorithmes et techniques d\'apprentissage automatique',
    'Deep Learning': 'Réseaux de neurones profonds et architectures avancées',
    'NLP': 'Traitement du langage naturel et compréhension du texte',
    'Computer Vision': 'Vision par ordinateur et analyse d\'images',
    'IA Générale': 'Actualités et discussions générales sur l\'IA',
    'Éthique IA': 'Questions éthiques et sociétales liées à l\'IA',
    'Actualités': 'Dernières nouvelles du monde de l\'IA'
  };

  const categoryIcons = {
    'Machine Learning': '🤖',
    'Deep Learning': '🧠',
    'NLP': '💬',
    'Computer Vision': '👁️',
    'IA Générale': '🌐',
    'Éthique IA': '⚖️',
    'Actualités': '📰'
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="categories-page">
      <SEO
        data={{
          title: 'Catégories | IA Blog',
          description: 'Explorez nos différentes catégories d\'articles sur l\'intelligence artificielle',
          url: `${process.env.REACT_APP_SITE_URL}/categories`,
        }}
      />

      <div className="container">
        <header className="page-header">
          <h1>Catégories</h1>
          <p>Explorez nos articles par thématique</p>
        </header>

        <div className="categories-grid">
          {stats.map((stat) => (
            <Link
              key={stat._id}
              to={`/?category=${stat._id}`}
              className="category-card"
            >
              <div className="category-icon">
                {categoryIcons[stat._id] || '📚'}
              </div>
              <h2>{stat._id}</h2>
              <p className="category-description">
                {categoryDescriptions[stat._id] || 'Articles de cette catégorie'}
              </p>
              <span className="article-count">
                {stat.count} article{stat.count > 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
