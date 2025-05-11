import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.getOrder(id);
        setOrder(response);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="order-details-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/orders')}>Retour aux commandes</button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-container">
        <div className="error-message">Commande non trouvée</div>
        <button onClick={() => navigate('/orders')}>Retour aux commandes</button>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h2>Commande #{order.id}</h2>
        <div className="order-status">
          Statut: <span className={`status ${order.status.toLowerCase()}`}>
            {order.status === 'pending' && 'En attente'}
            {order.status === 'processing' && 'En cours de traitement'}
            {order.status === 'shipped' && 'Expédiée'}
            {order.status === 'delivered' && 'Livrée'}
            {order.status === 'cancelled' && 'Annulée'}
          </span>
        </div>
      </div>

      <div className="order-info">
        <div className="info-section">
          <h3>Informations de Livraison</h3>
          <p><strong>Nom:</strong> {order.delivery_name}</p>
          <p><strong>Adresse:</strong> {order.delivery_address}</p>
          {order.delivery_message && (
            <p><strong>Message:</strong> {order.delivery_message}</p>
          )}
        </div>

        <div className="info-section">
          <h3>Détails de la Commande</h3>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> {new Date(order.created_at).toLocaleTimeString('fr-FR')}</p>
        </div>
      </div>

      <div className="order-items">
        <h3>Articles Commandés</h3>
        {Array.isArray(order.items) && order.items.map((item) => (
          <div key={item.id} className="order-item">
            <img 
              src={item.image_url || '/placeholder.png'} 
              alt={item.name || 'Produit'} 
              className="item-image" 
            />
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>Quantité: {item.quantity}</p>
              <p className="item-price">{parseFloat(item.price).toFixed(2)} €</p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <div className="total">
          <span>Total de la commande:</span>
          <span>{parseFloat(order.total).toFixed(2)} €</span>
        </div>
      </div>

      <button onClick={() => navigate('/orders')} className="back-button">
        Retour aux commandes
      </button>
    </div>
  );
};

export default OrderDetails; 