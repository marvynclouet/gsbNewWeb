import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBox, FaEuroSign, FaTags } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/Admin.css';

const Medicaments = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicament, setEditingMedicament] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: ''
  });

  useEffect(() => {
    fetchMedicaments();
  }, []);

  const fetchMedicaments = async () => {
    try {
      const data = await api.getMedicaments();
      setMedicaments(data);
    } catch (err) {
      setError('Erreur lors du chargement des médicaments');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMedicament) {
        await api.updateMedicament(editingMedicament.id, formData);
      } else {
        await api.createMedicament(formData);
      }
      setShowForm(false);
      setEditingMedicament(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image_url: ''
      });
      fetchMedicaments();
    } catch (err) {
      setError('Erreur lors de la sauvegarde du médicament');
      console.error('Erreur:', err);
    }
  };

  const handleEdit = (medicament) => {
    setEditingMedicament(medicament);
    setFormData({
      name: medicament.name,
      description: medicament.description || '',
      price: medicament.price,
      stock: medicament.stock,
      category: medicament.category || '',
      image_url: medicament.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      try {
        await api.deleteMedicament(id);
        fetchMedicaments();
      } catch (err) {
        setError('Erreur lors de la suppression du médicament');
        console.error('Erreur:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestion des Médicaments</h1>
        <button 
          className="add-button"
          onClick={() => {
            setEditingMedicament(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              stock: '',
              category: '',
              image_url: ''
            });
            setShowForm(true);
          }}
        >
          <FaPlus /> Ajouter un médicament
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicaments.map((medicament) => (
              <tr key={medicament.id}>
                <td className="image-cell">
                  <div className="medicament-image">
                    <img 
                      src={medicament.image_url || '/placeholder.png'} 
                      alt={medicament.name}
                      onError={(e) => e.target.src = '/placeholder.png'}
                    />
                  </div>
                </td>
                <td>{medicament.name}</td>
                <td className="description-cell">
                  {medicament.description || 'Aucune description'}
                </td>
                <td className="price-cell">
                  <div className="price-badge">
                    <FaEuroSign /> {
                      (() => {
                        try {
                          const price = typeof medicament.price === 'number' ? medicament.price : Number(medicament.price);
                          return isNaN(price) ? '0.00' : price.toFixed(2);
                        } catch {
                          return '0.00';
                        }
                      })()
                    }
                  </div>
                </td>
                <td className="stock-cell">
                  <div className={`stock-badge ${medicament.stock < 10 ? 'low-stock' : ''}`}>
                    <FaBox /> {medicament.stock}
                  </div>
                </td>
                <td className="category-cell">
                  <div className="category-badge">
                    <FaTags /> {medicament.category || 'Non catégorisé'}
                  </div>
                </td>
                <td className="actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(medicament)}
                    title="Modifier"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(medicament.id)}
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingMedicament ? 'Modifier le médicament' : 'Ajouter un médicament'}</h2>
            <form onSubmit={handleSubmit} className="medicament-form">
              <div className="form-group">
                <label htmlFor="name">Nom</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nom du médicament"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description du médicament"
                  rows="4"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Prix (€)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="category">Catégorie</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Catégorie du médicament"
                />
              </div>
              <div className="form-group">
                <label htmlFor="image_url">URL de l'image</label>
                <input
                  type="text"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="/images/nom-du-medicament.jpg"
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="submit-button">
                  {editingMedicament ? 'Modifier' : 'Ajouter'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingMedicament(null);
                  }}
                  className="cancel-button"
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

export default Medicaments; 