import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

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
      setUser({
        role: role || 'user',
        token
      });
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'authentification:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password, isAdmin = false) => {
    try {
      setError(null);
      const response = isAdmin 
        ? await api.auth.adminLogin(email, password)
        : await api.auth.login(email, password);

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