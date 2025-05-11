import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    siret: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          const userData = await api.getProfile();
          setFormData({
            name: userData.name || '',
            siret: userData.siret || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
            postal_code: userData.postal_code || ''
          });
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les données du profil');
      }
    };

    loadUserData();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateProfile(formData);
      setSuccess('Profil mis à jour avec succès');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mon Profil</h1>
        <p className="profile-subtitle">Gérez les informations de votre pharmacie</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i>
          {success}
        </div>
      )}

      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">
              <i className="fas fa-building"></i>
              Nom de la pharmacie
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Entrez le nom de votre pharmacie"
            />
          </div>

          <div className="form-group">
            <label htmlFor="siret">
              <i className="fas fa-id-card"></i>
              Numéro SIRET
            </label>
            <input
              type="text"
              id="siret"
              name="siret"
              value={formData.siret}
              onChange={handleChange}
              required
              placeholder="Entrez votre numéro SIRET"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Entrez votre email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <i className="fas fa-phone"></i>
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Entrez votre numéro de téléphone"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">
              <i className="fas fa-map-marker-alt"></i>
              Adresse
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Entrez votre adresse"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">
              <i className="fas fa-city"></i>
              Ville
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Entrez votre ville"
            />
          </div>

          <div className="form-group">
            <label htmlFor="postal_code">
              <i className="fas fa-mail-bulk"></i>
              Code postal
            </label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              required
              placeholder="Entrez votre code postal"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Mise à jour...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Mettre à jour le profil
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 