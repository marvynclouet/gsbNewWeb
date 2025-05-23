
const API_URL = 'http://localhost:5000/api';


const getHeaders = (jsonContentAuthorized = true) => {
  const token = localStorage.getItem('token');

  if(jsonContentAuthorized){
    return    { 
      'Content-Type': 'application/json', 
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})}
  }

  return {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};



const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    console.error('Erreur serveur:', errorData);
    throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

const api = {
  // Méthodes HTTP de base
  get: async (endpoint) => {
    try {
      console.log('GET:', `${API_URL}${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: getHeaders(),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la requête GET:', error);
      throw error;
    }
  },

  post: async (endpoint, data, jsonContentAuthorized = true) => {
    try {
      console.log('POST:', `${API_URL}${endpoint}`);
      console.log('Données:', data);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(jsonContentAuthorized),
        body: (data instanceof FormData ) ? data : JSON.stringify(data),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la requête POST:', error);
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      console.log('PUT:', `${API_URL}${endpoint}`);
      console.log('Données:', data);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la requête PUT:', error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      console.log('DELETE:', `${API_URL}${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la requête DELETE:', error);
      throw error;
    }
  },

  // Méthodes spécifiques à l'authentification
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },


  register: async (userData) => {
    return api.post('/auth/register', userData);
  },

  // Méthodes spécifiques au profil utilisateur
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response;
    } catch (error) {
      console.error('Erreur getProfile:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    return api.post('/users/profile', profileData);
  },

  // Méthodes spécifiques aux médicaments
  getMedicaments: async () => {
    return api.get('/medicaments');
  },

  getMedicament: async (id) => {
    return api.get(`/medicaments/${id}`);
  },

  // Méthodes spécifiques aux commandes
  getOrders: async () => {
    return api.get('/orders');
  },

  getUserOrders: async () => {
    return api.get('/orders');
  },

  getOrder: async (id) => {
    return api.get(`/orders/${id}`);
  },

  createOrder: async (orderData) => {
    return api.post('/orders', orderData);
  },

  updateOrder: async (id, orderData) => {
    return api.put(`/orders/${id}`, orderData);
  },

  deleteOrder: async (id) => {
    return api.delete(`/orders/${id}`);
  },

  // Cart
  getCart: () => api.get('/cart'),
  addToCart: (item) => api.post('/cart', item),
  updateCartItem: (id, quantity) => api.post(`/cart/${id}`, { quantity }),
  removeFromCart: (id) => api.post(`/cart/${id}/remove`),

  // Fonctions pour l'administration
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  createMedicament: (medicamentData) => api.post('/medicaments', medicamentData, false),
  updateMedicament: (medicamentId, medicamentData) => api.put(`/medicaments/${medicamentId}`, medicamentData),
  deleteMedicament: (medicamentId) => api.delete(`/medicaments/${medicamentId}`),
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
  getStats: () => api.get('/stats')
};

export default api; 


function objectToFormData(obj) {
  const formData = new FormData();
  for (const key in obj) {
      formData.append(key, obj[key]);
  }
  return formData;
}

export { objectToFormData }