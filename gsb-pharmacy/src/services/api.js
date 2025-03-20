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
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la requête');
    }
    return response.json();
  },

  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),

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
  updateProfile: (userData) => api.post('/users/profile', userData)
};

export default api; 