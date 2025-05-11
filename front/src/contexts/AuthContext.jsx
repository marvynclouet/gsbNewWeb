import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await api.getProfile();
      if (userData) {
        setUser({
          ...userData,
          role: role || 'user',
          token
        });
      } else {
        throw new Error('Données utilisateur non trouvées');
      }
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'authentification:', err);
      // Ne pas déconnecter immédiatement en cas d'erreur
      // Attendre une seconde tentative
      try {
        const retryData = await api.getProfile();
        if (retryData) {
          setUser({
            ...retryData,
            role: role || 'user',
            token
          });
        } else {
          throw new Error('Données utilisateur non trouvées après nouvelle tentative');
        }
      } catch (retryErr) {
        console.error('Échec de la nouvelle tentative:', retryErr);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = credentials.isAdmin 
        ? await api.adminLogin(credentials.email, credentials.password)
        : await api.login(credentials);

      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.user?.role || 'user');
        
        const userData = {
          ...response.user,
          token: response.token
        };
        
        setUser(userData);
        return userData;
      } else {
        throw new Error('Réponse de connexion invalide');
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await api.updateProfile(profileData);
      
      if (response) {
        setUser(prevUser => ({
          ...prevUser,
          ...response
        }));
        return response;
      } else {
        throw new Error('Réponse de mise à jour invalide');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du profil');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export default AuthContext; 