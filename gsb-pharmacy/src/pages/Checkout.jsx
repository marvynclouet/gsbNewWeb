import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    message: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          medicamentId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: calculateTotal(),
        message: formData.message
      };

      const order = await api.createOrder(orderData);
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Votre Panier est Vide</h2>
        <button onClick={() => navigate('/medicaments')} className="submit-button">
          Continuer vos achats
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Finaliser la Commande</h2>
      {error && (
        <div className="error-message">
          {error}
          {error.includes('serveur n\'est pas accessible') && (
            <div className="error-help">
              <p>Pour résoudre ce problème :</p>
              <ol>
                <li>Vérifiez que le serveur backend est en cours d'exécution</li>
                <li>Assurez-vous que le port 5000 est disponible</li>
                <li>Vérifiez votre connexion internet</li>
              </ol>
            </div>
          )}
        </div>
      )}
      
      <div className="checkout-content">
        <div className="order-summary">
          <h3>Récapitulatif de la Commande</h3>
          {items.map((item) => {
            const price = parseFloat(item.price) || 0;
            return (
              <div key={item.id} className="order-item">
                <img 
                  src={item.image_url || '/placeholder.png'} 
                  alt={item.name || 'Produit'} 
                  className="item-image" 
                />
                <div className="item-details">
                  <h4>{item.name || 'Produit sans nom'}</h4>
                  <p>Quantité: {item.quantity}</p>
                  <p className="item-price">{price.toFixed(2)} €</p>
                </div>
              </div>
            );
          })}
          <div className="order-total">
            <span>Total:</span>
            <span>{calculateTotal().toFixed(2)} €</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Informations de Livraison</h3>
          
          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              value={user?.name || ''}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <input
              type="text"
              id="address"
              value={user?.address || ''}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message de livraison (optionnel)</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Instructions spéciales pour la livraison..."
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout; 