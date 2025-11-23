import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import adminService from '../../services/adminService';
import '../../styles/Admin.css';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [converting, setConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertArticles = async () => {
    if (!window.confirm('Voulez-vous convertir tous les articles Markdown en HTML ? Cette action mettra à jour tous les articles contenant du Markdown brut.')) {
      return;
    }

    try {
      setConverting(true);
      setConversionResult(null);
      const response = await adminService.convertArticles();
      setConversionResult(response.data);
      loadStats(); // Recharger les stats
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la conversion');
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Dashboard Admin</h1>
        <p>Bienvenue, {user?.username}</p>
      </div>

      {conversionResult && (
        <div className="alert alert-success">
          ✅ Conversion terminée ! {conversionResult.converted} article(s) converti(s), {conversionResult.skipped} ignoré(s)
        </div>
      )}

      {user?.role === 'admin' && (
        <div style={{ marginBottom: '35px' }}>
          <button
            onClick={handleConvertArticles}
            disabled={converting}
            className="btn-secondary"
            style={{ width: 'auto' }}
          >
            {converting ? '⚙️ Conversion en cours...' : '🔄 Convertir les articles Markdown en HTML'}
          </button>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '10px' }}>
            Convertit tous les articles existants avec du Markdown brut (##, **) en HTML formaté
          </p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Total Articles</h3>
            <p className="stat-number">{stats?.totalArticles || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Publiés</h3>
            <p className="stat-number">{stats?.publishedArticles || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Brouillons</h3>
            <p className="stat-number">{stats?.draftArticles || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <h3>Vues Totales</h3>
            <p className="stat-number">{stats?.totalViews || 0}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Actions Rapides</h2>
        <div className="actions-grid">
          <Link to="/admin/generate" className="action-card">
            <span className="action-icon">✨</span>
            <h3>Générer un Article IA</h3>
            <p>Créez un nouvel article avec l'IA</p>
          </Link>

          <Link to="/admin/articles" className="action-card">
            <span className="action-icon">📋</span>
            <h3>Gérer les Articles</h3>
            <p>Voir et modifier vos articles</p>
          </Link>
        </div>
      </div>

      {stats?.recentArticles && stats.recentArticles.length > 0 && (
        <div className="recent-articles">
          <h2>Articles Récents</h2>
          <div className="articles-table">
            <table>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Vues</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentArticles.map((article) => (
                  <tr key={article._id}>
                    <td>{article.title}</td>
                    <td>{new Date(article.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <span className={`status-badge ${article.published ? 'published' : 'draft'}`}>
                        {article.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td>{article.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stats?.topArticles && stats.topArticles.length > 0 && (
        <div className="top-articles">
          <h2>Articles les Plus Vus</h2>
          <div className="articles-table">
            <table>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Vues</th>
                </tr>
              </thead>
              <tbody>
                {stats.topArticles.map((article) => (
                  <tr key={article._id}>
                    <td>{article.title}</td>
                    <td>{article.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
