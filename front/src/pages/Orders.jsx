import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.getUserOrders();
        setOrders(response);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Chargement des commandes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="no-orders">
          <h2>Aucune commande</h2>
          <p>Vous n'avez pas encore passé de commande.</p>
          <Link to="/medicaments" className="reorder-btn">
            Voir les médicaments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>Mes Commandes</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Commande #{order.id}</h3>
                <p className="order-date">
                  {new Date(order.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="order-status">
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status === 'pending' && 'En attente'}
                  {order.status === 'processing' && 'En cours de traitement'}
                  {order.status === 'shipped' && 'Expédiée'}
                  {order.status === 'delivered' && 'Livrée'}
                  {order.status === 'cancelled' && 'Annulée'}
                </span>
              </div>
            </div>

            <div className="order-items">
              {Array.isArray(order.items) && order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img 
                    src={item.image_url || '/placeholder.png'} 
                    alt={item.name || 'Produit'} 
                    className="item-image" 
                  />
                  <div className="item-details">
                    <h4>{item.name || 'Produit sans nom'}</h4>
                    <p>Quantité: {item.quantity}</p>
                    <p className="item-price">{parseFloat(item.price).toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">
                Total: {parseFloat(order.total).toFixed(2)} €
              </div>
              <Link to={`/orders/${order.id}`} className="reorder-btn">
                Voir les détails
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders; 