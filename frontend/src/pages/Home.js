import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import SEO from '../components/SEO';
import { articlesAPI } from '../services/api';
import { generateWebsiteSchema } from '../utils/seo';
import '../styles/Home.css';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articlesAPI.getAll({ page: currentPage, limit: 10 });
      setArticles(data.data);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des articles');
      setLoading(false);
      console.error('Error fetching articles:', err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement des articles...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home">
      <SEO
        data={{
          title: 'IA Blog - Intelligence Artificielle et Machine Learning',
          description: 'Découvrez les dernières innovations en intelligence artificielle, machine learning, deep learning et plus encore.',
          url: process.env.REACT_APP_SITE_URL,
          type: 'website',
        }}
        schema={generateWebsiteSchema()}
      />

      <section className="hero">
        <div className="container">
          <h1>Bienvenue sur IA Blog</h1>
          <p className="hero-subtitle">
            Votre source d'information sur l'intelligence artificielle et le machine learning
          </p>
        </div>
      </section>

      <section className="articles-section">
        <div className="container">
          <h2>Derniers articles</h2>
          {articles.length === 0 ? (
            <p className="no-articles">Aucun article disponible pour le moment.</p>
          ) : (
            <>
              <div className="articles-grid">
                {articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    ← Précédent
                  </button>
                  <span className="page-info">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
