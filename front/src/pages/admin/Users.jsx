import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import '../../styles/Admin.css';

const Users = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    siret: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    address: '',
    city: '',
    postal_code: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(err.message || 'Erreur lors de la récupération des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      siret: '',
      email: '',
      password: '',
      role: 'user',
      phone: '',
      address: '',
      city: '',
      postal_code: ''
    });
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      ...user,
      password: '' // Ne pas afficher le mot de passe existant
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await api.deleteUser(userId);
        fetchUsers(); // Rafraîchir la liste
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression de l\'utilisateur');
        console.error('Erreur de suppression:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Mise à jour d'un utilisateur existant
        await api.updateUser(editingUser.id, formData);
      } else {
        // Création d'un nouvel utilisateur
        await api.createUser(formData);
      }
      
      setShowModal(false);
      resetForm();
      fetchUsers(); // Rafraîchir la liste des utilisateurs
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'opération');
      console.error('Erreur de soumission:', err);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestion des Utilisateurs</h1>
        <button className="add-button" onClick={() => setShowModal(true)}>
          <FaPlus /> Ajouter un utilisateur
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>SIRET</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Téléphone</th>
              <th>Ville</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.siret}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.phone}</td>
                <td>{user.city}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(user)} className="edit-button">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="delete-button">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nom de l'entreprise</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="siret">SIRET</label>
                <input
                  type="text"
                  id="siret"
                  name="siret"
                  value={formData.siret}
                  onChange={handleInputChange}
                  pattern="[0-9]{14}"
                  title="Le SIRET doit contenir 14 chiffres"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  {editingUser ? 'Mot de passe (laisser vide pour ne pas modifier)' : 'Mot de passe'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Rôle</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Adresse</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">Ville</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="postal_code">Code postal</label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  pattern="[0-9]{5}"
                  title="Le code postal doit contenir 5 chiffres"
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="submit-button">
                  {editingUser ? 'Modifier' : 'Ajouter'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users; 