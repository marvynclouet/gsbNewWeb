import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/Admin.css';

const Orders = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [isAdmin, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/orders/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la récupération des commandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA500'; // Orange
      case 'processing':
        return '#4CAF50'; // Vert
      case 'shipped':
        return '#2196F3'; // Bleu
      case 'delivered':
        return '#8BC34A'; // Vert clair
      case 'cancelled':
        return '#f44336'; // Rouge
      default:
        return '#757575'; // Gris
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      fetchOrders(); // Rafraîchir la liste des commandes
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de la commande');
        }

        // Rafraîchir la liste des commandes
        fetchOrders();
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors de la suppression de la commande');
      }
    }
  };

  const handleEdit = (order) => {
    setEditMode(true);
    setSelectedOrder(order);
    setEditedOrder({
      ...order,
      items: [...order.items]
    });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/orders/${editedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          delivery_name: editedOrder.delivery_name,
          delivery_address: editedOrder.delivery_address,
          delivery_message: editedOrder.delivery_message,
          total: editedOrder.total,
          items: editedOrder.items
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la commande');
      }

      // Rafraîchir la liste des commandes
      fetchOrders();
      setShowModal(false);
      setEditMode(false);
      setEditedOrder(null);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la mise à jour de la commande');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setEditedOrder(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: field === 'quantity' ? parseInt(value, 10) : parseFloat(value)
      };
      return {
        ...prev,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    });
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestion des Commandes</h1>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Commande</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user_name || 'Client inconnu'}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>{calculateTotal(order.items)}€</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="status-select"
                    style={{ 
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <option value="pending">En attente</option>
                    <option value="processing">En traitement</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </td>
                <td className="actions">
                  <button
                    onClick={() => handleEdit(order)}
                    className="edit-button"
                    title="Modifier la commande"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="view-button"
                    title="Voir les détails"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="delete-button"
                    title="Supprimer la commande"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (selectedOrder || editedOrder) && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editMode ? 'Modifier la commande' : 'Détails de la commande'} #{editMode ? editedOrder.id : selectedOrder.id}</h2>
            
            <div className="order-modal-content">
              <div className="order-modal-section">
                <h3>Informations client</h3>
                <div className="form-group">
                  <label>Nom de livraison :</label>
                  <input
                    type="text"
                    name="delivery_name"
                    value={editedOrder.delivery_name || selectedOrder.delivery_name}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Adresse de livraison :</label>
                  <textarea
                    name="delivery_address"
                    value={editedOrder.delivery_address || selectedOrder.delivery_address}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="3"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Instructions de livraison :</label>
                  <textarea
                    name="delivery_message"
                    value={editedOrder.delivery_message || selectedOrder.delivery_message}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div className="order-modal-section articles">
                <h3>Articles commandés</h3>
                <div className="order-modal-articles">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(editMode ? editedOrder.items : selectedOrder.items).map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>
                            {editMode ? (
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                className="form-control"
                              />
                            ) : (
                              item.quantity
                            )}
                          </td>
                          <td>
                            {editMode ? (
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                className="form-control"
                              />
                            ) : (
                              `${item.price}€`
                            )}
                          </td>
                          <td>{(item.price * item.quantity).toFixed(2)}€</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3"><strong>Total</strong></td>
                        <td>
                          <strong>
                            {editMode ? 
                              editedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2) :
                              calculateTotal(selectedOrder.items)
                            }€
                          </strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-buttons">
              {editMode ? (
                <>
                  <button className="submit-button" onClick={handleSaveEdit}>
                    Enregistrer
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={() => {
                      setEditMode(false);
                      setShowModal(false);
                      setEditedOrder(null);
                    }}
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <button 
                  className="cancel-button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  Fermer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 