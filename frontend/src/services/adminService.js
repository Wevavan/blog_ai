import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const adminAPI = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const adminService = {
  // Générer un article avec l'IA
  generateArticle: async (topic, category, tone = 'professionnel', length = 'moyen') => {
    const response = await adminAPI.post('/generate', {
      topic,
      category,
      tone,
      length,
    });
    return response.data;
  },

  // Obtenir les statistiques du dashboard
  getStats: async () => {
    const response = await adminAPI.get('/stats');
    return response.data;
  },

  // Convertir les articles Markdown en HTML
  convertArticles: async () => {
    const response = await adminAPI.post('/convert-articles');
    return response.data;
  },

  // Obtenir tous les articles (y compris brouillons)
  getAllArticles: async (page = 1, limit = 20, published) => {
    const params = { page, limit };
    if (published !== undefined) {
      params.published = published;
    }
    const response = await adminAPI.get('/articles', { params });
    return response.data;
  },

  // Créer un article
  createArticle: async (articleData) => {
    const response = await adminAPI.post('/articles', articleData);
    return response.data;
  },

  // Mettre à jour un article
  updateArticle: async (id, articleData) => {
    const response = await adminAPI.put(`/articles/${id}`, articleData);
    return response.data;
  },

  // Supprimer un article
  deleteArticle: async (id) => {
    const response = await adminAPI.delete(`/articles/${id}`);
    return response.data;
  },
};

export default adminService;
