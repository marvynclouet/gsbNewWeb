const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la requête');
    }
    return response.json();
  },

  post: async (endpoint, data) => {
    try {
      console.log('Envoi de la requête à:', `${API_URL}${endpoint}`);
      console.log('Données envoyées:', data);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur serveur' }));
        console.error('Erreur serveur:', errorData);
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      throw error;
    }
  },

  // Auth
  login: async (email, password) => {
    try {
      console.log('Tentative de connexion avec:', { email, password });
      const response = await api.post('/auth/login', { email, password });
      console.log('Réponse de connexion:', response);
      return response;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    // Suppression du token et des données utilisateur du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirection vers la page de connexion
    window.location.href = '/login';
  },

  // Orders
  getOrders: () => api.get('/orders'),
  getUserOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),

  // Cart
  getCart: () => api.get('/cart'),
  addToCart: (item) => api.post('/cart', item),
  updateCartItem: (id, quantity) => api.post(`/cart/${id}`, { quantity }),
  removeFromCart: (id) => api.post(`/cart/${id}/remove`),

  // Medicaments
  getMedicaments: () => api.get('/medicaments'),
  getMedicament: (id) => api.get(`/medicaments/${id}`),

  // User
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.post('/users/profile', userData),

  // Fonctions pour l'administration
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  createMedicament: (medicamentData) => api.post('/medicaments', medicamentData),
  updateMedicament: (medicamentId, medicamentData) => api.put(`/medicaments/${medicamentId}`, medicamentData),
  deleteMedicament: (medicamentId) => api.delete(`/medicaments/${medicamentId}`),
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
  getStats: () => api.get('/stats')
};

export default api; 