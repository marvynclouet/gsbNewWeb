import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import '../styles/Medicaments.css';

const Medicaments = () => {
  const { addToCart } = useCart();
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchMedicaments();
  }, []);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="medicaments-container">
      <h1>Nos Médicaments</h1>
      <div className="medicaments-list">
        <div className="list-header">
          <div className="header-item image">Image</div>
          <div className="header-item nom">Nom</div>
          <div className="header-item description">Description</div>
          <div className="header-item prix">Prix</div>
          <div className="header-item stock">Stock</div>
          <div className="header-item action">Action</div>
        </div>
        {medicaments.map((medicament) => (
          <div key={medicament.id} className="medicament-row">
            <div className="list-item image">
              <img src={medicament.image_url || '/placeholder.png'} alt={medicament.name} />
            </div>
            <div className="list-item nom">{medicament.name}</div>
            <div className="list-item description">{medicament.description}</div>
            <div className="list-item prix">{medicament.price}€</div>
            <div className="list-item stock">
              <span className={`stock-badge ${medicament.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {medicament.stock > 0 ? 'En stock' : 'Rupture de stock'}
              </span>
            </div>
            <div className="list-item action">
              <button 
                className="commander-btn" 
                disabled={medicament.stock <= 0}
                onClick={() => addToCart(medicament)}
              >
                {medicament.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Medicaments; 