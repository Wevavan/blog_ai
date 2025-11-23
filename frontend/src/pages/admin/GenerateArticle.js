import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import '../../styles/Admin.css';

function GenerateArticle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    category: 'IA Générale',
    tone: 'professionnel',
    length: 'moyen',
    useCustomWordCount: false,
    customWordCount: '',
  });
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const categories = [
    'IA Générale',
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'Computer Vision',
    'Robotique',
    'IA Éthique',
    'Applications IA',
  ];

  const tones = [
    { value: 'professionnel', label: 'Professionnel' },
    { value: 'technique', label: 'Technique' },
    { value: 'vulgarisation', label: 'Vulgarisation' },
    { value: 'académique', label: 'Académique' },
  ];

  const lengths = [
    { value: 'court', label: 'Court (500 mots)' },
    { value: 'moyen', label: 'Moyen (1000 mots)' },
    { value: 'long', label: 'Long (2000 mots)' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setGeneratedArticle(null);

    try {
      // Déterminer le nombre de mots à utiliser
      const wordCount = formData.useCustomWordCount && formData.customWordCount
        ? parseInt(formData.customWordCount)
        : null;

      const response = await adminService.generateArticle(
        formData.topic,
        formData.category,
        formData.tone,
        formData.length,
        wordCount
      );
      setGeneratedArticle(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (published = true) => {
    setSaving(true);
    setError('');

    try {
      // Préparer les données: utiliser htmlContent comme content
      const articleData = {
        title: generatedArticle.title,
        content: generatedArticle.htmlContent || generatedArticle.content,
        excerpt: generatedArticle.excerpt,
        category: generatedArticle.category,
        tags: generatedArticle.tags,
        author: generatedArticle.author,
        metaDescription: generatedArticle.metaDescription,
        published,
      };

      await adminService.createArticle(articleData);
      navigate('/admin/articles');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Générer un Article avec l'IA</h1>
        <p>Créez un article de qualité en quelques secondes</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="generate-container">
        <form onSubmit={handleGenerate} className="generate-form">
          <div className="form-group">
            <label htmlFor="topic">Sujet de l'article *</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Ex: Les transformers en NLP"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tone">Ton</label>
              <select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleChange}
              >
                {tones.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="length">Longueur</label>
              <select
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                disabled={formData.useCustomWordCount}
              >
                {lengths.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="useCustomWordCount"
                checked={formData.useCustomWordCount}
                onChange={handleChange}
              />
              <span>Nombre de mots personnalisé</span>
            </label>
            {formData.useCustomWordCount && (
              <input
                type="number"
                name="customWordCount"
                value={formData.customWordCount}
                onChange={handleChange}
                placeholder="Ex: 1500"
                min="100"
                max="5000"
                style={{ marginTop: '10px' }}
                required
              />
            )}
            {formData.useCustomWordCount && (
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                Entrez le nombre exact de mots souhaité (100-5000). L'IA respectera ce nombre très précisément.
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '⚙️ Génération en cours...' : '✨ Générer l\'article'}
          </button>
        </form>

        {generatedArticle && (
          <div className="article-preview">
            <div className="preview-header">
              <h2>Aperçu de l'article généré</h2>
              <div className="preview-actions">
                <button
                  onClick={() => handlePublish(false)}
                  className="btn-secondary"
                  disabled={saving}
                >
                  💾 Enregistrer comme brouillon
                </button>
                <button
                  onClick={() => handlePublish(true)}
                  className="btn-primary"
                  disabled={saving}
                >
                  🚀 Publier
                </button>
              </div>
            </div>

            <div className="preview-content">
              <h1 className="preview-title">{generatedArticle.title}</h1>

              <div className="preview-meta">
                <span className="preview-category">{generatedArticle.category}</span>
                <span className="preview-author">{generatedArticle.author}</span>
              </div>

              <p className="preview-excerpt">{generatedArticle.excerpt}</p>

              <div
                className="preview-body"
                dangerouslySetInnerHTML={{ __html: generatedArticle.htmlContent }}
              />

              {generatedArticle.tags && generatedArticle.tags.length > 0 && (
                <div className="preview-tags">
                  {generatedArticle.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="preview-seo">
                <h3>SEO</h3>
                <p><strong>Meta Description:</strong> {generatedArticle.metaDescription}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateArticle;
