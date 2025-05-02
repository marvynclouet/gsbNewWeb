const API_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  if (!response.ok) {
    let errorMessage;
    if (isJson) {
      const errorData = await response.json();
      errorMessage = errorData.message || response.statusText;
    } else {
      errorMessage = await response.text() || response.statusText;
    }
    
    console.error('Réponse serveur:', {
      status: response.status,
      statusText: response.statusText,
      contentType,
      errorMessage
    });
    
    throw new Error(errorMessage);
  }

  if (!isJson) {
    console.error('Réponse non-JSON reçue:', {
      status: response.status,
      contentType
    });
    throw new Error('Format de réponse invalide');
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur parsing JSON:', error);
    throw new Error('Erreur de format de réponse');
  }
};

const api = {
  // Authentification
  auth: {
    login: async (email, password) => {
      try {
        console.log('Tentative de connexion:', { email });
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Erreur login:', error);
        throw error;
      }
    },

    adminLogin: async (email, password) => {
      try {
        console.log('Tentative de connexion admin:', { email });
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await handleResponse(response);
        
        console.log('Réponse connexion:', data);
        
        // Vérifier si l'utilisateur est un admin
        if (!data.user) {
          throw new Error('Réponse invalide du serveur - données utilisateur manquantes');
        }
        
        if (data.user.role !== 'admin') {
          throw new Error('Accès non autorisé - Compte non administrateur');
        }
        
        return data;
      } catch (error) {
        console.error('Erreur adminLogin:', error);
        throw error;
      }
    },

    register: async (userData) => {
      try {
        console.log('Tentative d\'inscription:', userData);
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Erreur register:', error);
        throw new Error('Erreur lors de l\'inscription');
      }
    },

    createAdmin: async (adminData) => {
      try {
        const response = await fetch(`${API_URL}/admin/register`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(adminData)
        });
        return handleResponse(response);
      } catch (error) {
        console.log(error)
        throw new Error('Erreur lors de la création du compte administrateur');
      }
    }
  },

  // Utilisateurs
  users: {
    getCurrent: async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Erreur getCurrent:', error);
        throw new Error('Erreur lors de la récupération du profil');
      }
    },

    update: async (userData) => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Erreur update:', error);
        throw new Error('Erreur lors de la mise à jour du profil');
      }
    }
  }

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