import React, { createContext, useState, useContext } from 'react';
import api from '../utils/api';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState();
  const [error, setError] = useState(null);


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
      }
      else {
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
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

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