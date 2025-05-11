import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../styles/MedicamentDetail.css';

const MedicamentDetail = ({ medicament, onClose, onAddToCart }) => {
  if (!medicament) return null;

  return (
    <div className="medicament-detail-overlay" onClick={onClose}>
      <div className="medicament-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="medicament-detail-content">
          <div className="medicament-detail-image">
            <img 
              src={medicament.image_url || '/placeholder.png'} 
              alt={medicament.name}
              onError={(e) => e.target.src = '/placeholder.png'}
            />
          </div>
          
          <div className="medicament-detail-info">
            <h2>{medicament.name}</h2>
            <div className="medicament-detail-price">
              {medicament.price}€
            </div>
            <div className="medicament-detail-stock">
              <span className={`stock-badge ${medicament.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {medicament.stock > 0 ? 'En stock' : 'Rupture de stock'}
              </span>
            </div>
            <div className="medicament-detail-description">
              <h3>Description</h3>
              <p>{medicament.description}</p>
            </div>
            <button 
              className="add-to-cart-btn"
              disabled={medicament.stock <= 0}
              onClick={e => onAddToCart(e, medicament)}
            >
              {medicament.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicamentDetail; 