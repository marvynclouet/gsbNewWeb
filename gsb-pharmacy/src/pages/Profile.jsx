import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '06 12 34 56 78',
    address: '123 rue Example, 75000 Paris',
    birthDate: '1990-01-01',
    socialSecurity: '1234567890123',
    profilePicture: 'https://via.placeholder.com/200'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour sauvegarder les modifications
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Mon Profil</h2>
        <div className="header-actions">
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Modifier
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-photo">
          <img src={user.profilePicture} alt="Photo de profil" />
          {isEditing && (
            <div className="photo-upload">
              <label className="upload-btn">
                Changer la photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <textarea
              name="address"
              value={user.address}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Date de naissance</label>
            <input
              type="date"
              name="birthDate"
              value={user.birthDate}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Numéro de sécurité sociale</label>
            <input
              type="text"
              name="socialSecurity"
              value={user.socialSecurity}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="save-btn">
                Enregistrer
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Annuler
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile; 