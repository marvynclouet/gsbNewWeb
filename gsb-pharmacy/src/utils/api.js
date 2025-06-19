const API_URL = 'http://localhost:5000/api';


// parsing stream data into json 

const handleJsonResponse = async (response) => {  
  try{
      let errorMessage;
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (isJson) {
        const data = await response.json();
         return data
      } 
      else {
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
  catch(err){
    console.error('Erreur parsing JSON:', err);
    throw new Error('Erreur de format de réponse (parsing json)');
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
        return handleJsonResponse(response);
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
        const data = await handleJsonResponse(response);
        
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
        return handleJsonResponse(response);
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
        return handleJsonResponse(response);
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
        const response = await fetch(`${API_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const jsonFormat = handleJsonResponse(response)
        return { ...jsonFormat, token };
      } 
      catch (error) {
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
        return handleJsonResponse(response);
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