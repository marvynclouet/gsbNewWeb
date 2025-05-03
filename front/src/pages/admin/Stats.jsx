import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Admin.css';

const Stats = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    ordersByStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    },
    topProducts: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, [isAdmin, navigate]);

  const fetchStats = async () => {
    try {
      const [ordersResponse, medicamentsResponse] = await Promise.all([
        fetch('http://localhost:3000/api/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('http://localhost:3000/api/medicaments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (!ordersResponse.ok || !medicamentsResponse.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const orders = await ordersResponse.json();
      const medicaments = await medicamentsResponse.json();

      // Calcul des statistiques
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Comptage des commandes par statut
      const ordersByStatus = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      });

      // Calcul des produits les plus vendus
      const productSales = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          if (!productSales[item.medicamentId]) {
            productSales[item.medicamentId] = {
              quantity: 0,
              revenue: 0
            };
          }
          productSales[item.medicamentId].quantity += item.quantity;
          productSales[item.medicamentId].revenue += item.quantity * parseFloat(item.price);
        });
      });

      const topProducts = Object.entries(productSales)
        .map(([medicamentId, sales]) => {
          const medicament = medicaments.find(m => m.id === parseInt(medicamentId));
          return {
            id: medicamentId,
            name: medicament?.name || 'Produit inconnu',
            quantity: sales.quantity,
            revenue: sales.revenue
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Récupération des commandes récentes
      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setStats({
        totalOrders,
        totalRevenue,
        averageOrderValue,
        ordersByStatus,
        topProducts,
        recentOrders
      });
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des statistiques');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffa500';
      case 'processing':
        return '#007bff';
      case 'shipped':
        return '#28a745';
      case 'delivered':
        return '#6c757d';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return <div className="admin-container">Chargement...</div>;
  }

  return (
    <div className="admin-container">
      <h1>Statistiques</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stats-card">
          <h3>Commandes Totales</h3>
          <div className="stats-number">{stats.totalOrders}</div>
        </div>
        <div className="stats-card">
          <h3>Revenu Total</h3>
          <div className="stats-number">{stats.totalRevenue.toFixed(2)} €</div>
        </div>
        <div className="stats-card">
          <h3>Panier Moyen</h3>
          <div className="stats-number">{stats.averageOrderValue.toFixed(2)} €</div>
        </div>
      </div>

      <div className="stats-section">
        <h2>Commandes par Statut</h2>
        <div className="stats-chart">
          {Object.entries(stats.ordersByStatus).map(([status, count]) => (
            <div key={status} className="chart-bar">
              <div 
                className="bar-fill"
                style={{ 
                  height: `${(count / stats.totalOrders) * 100}%`,
                  backgroundColor: getStatusColor(status)
                }}
              >
                <span className="bar-value">{count}</span>
              </div>
              <span className="bar-label">{getStatusLabel(status)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <h2>Produits les Plus Vendus</h2>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité Vendue</th>
                <th>Revenu</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.revenue.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="stats-section">
        <h2>Commandes Récentes</h2>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.delivery_name}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.total.toFixed(2)} €</td>
                  <td>
                    <span style={{ 
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stats; 