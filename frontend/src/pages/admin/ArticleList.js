import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import '../../styles/Admin.css';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadArticles();
  }, [filter, currentPage]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const published = filter === 'all' ? undefined : filter === 'published';
      const response = await adminService.getAllArticles(currentPage, 20, published);
      setArticles(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      await adminService.deleteArticle(id);
      loadArticles();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleTogglePublish = async (article) => {
    try {
      await adminService.updateArticle(article._id, {
        published: !article.published,
      });
      loadArticles();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestion des Articles</h1>
        <Link to="/admin/generate" className="btn-primary">
          ✨ Créer un article
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => { setFilter('all'); setCurrentPage(1); }}
        >
          Tous ({articles.length})
        </button>
        <button
          className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
          onClick={() => { setFilter('published'); setCurrentPage(1); }}
        >
          Publiés
        </button>
        <button
          className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
          onClick={() => { setFilter('draft'); setCurrentPage(1); }}
        >
          Brouillons
        </button>
      </div>

      <div className="articles-table">
        {articles.length === 0 ? (
          <div className="no-articles">
            <p>Aucun article trouvé</p>
            <Link to="/admin/generate" className="btn-primary">
              Créer votre premier article
            </Link>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Auteur</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Vues</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id}>
                  <td className="article-title">
                    <Link to={`/articles/${article.slug}`} target="_blank">
                      {article.title}
                    </Link>
                  </td>
                  <td>{article.category}</td>
                  <td>{article.author}</td>
                  <td>{new Date(article.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span className={`status-badge ${article.published ? 'published' : 'draft'}`}>
                      {article.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td>{article.views}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleTogglePublish(article)}
                      className="btn-icon"
                      title={article.published ? 'Dépublier' : 'Publier'}
                    >
                      {article.published ? '👁️' : '📝'}
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="btn-icon btn-danger"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Précédent
          </button>
          <span className="page-info">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

export default ArticleList;
