import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Articles API
export const articlesAPI = {
  // Récupérer tous les articles
  getAll: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  // Récupérer un article par son slug
  getBySlug: async (slug) => {
    const response = await api.get(`/articles/${slug}`);
    return response.data;
  },

  // Rechercher des articles
  search: async (query) => {
    const response = await api.get('/articles/search', { params: { q: query } });
    return response.data;
  },

  // Obtenir les statistiques des catégories
  getCategoriesStats: async () => {
    const response = await api.get('/articles/stats/categories');
    return response.data;
  },

  // Créer un article (admin)
  create: async (articleData) => {
    const response = await api.post('/articles', articleData);
    return response.data;
  },

  // Mettre à jour un article (admin)
  update: async (id, articleData) => {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data;
  },

  // Supprimer un article (admin)
  delete: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },
};

export default api;
