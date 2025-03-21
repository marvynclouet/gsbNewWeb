import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPills, FaClipboardList, FaShoppingCart, FaChartLine, FaSearch, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const recentMedications = [
    { id: 1, name: 'Doliprane 1000mg', stock: 150, status: 'En stock' },
    { id: 2, name: 'Amoxicilline 500mg', stock: 75, status: 'Stock faible' },
    { id: 3, name: 'Ibuprofène 400mg', stock: 200, status: 'En stock' }
  ];

  const recentOrders = [
    { id: 'CMD-001', date: '2024-03-15', status: 'En cours', items: 5 },
    { id: 'CMD-002', date: '2024-03-14', status: 'En préparation', items: 3 }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicaments?search=${searchQuery}`);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bienvenue sur GSB Pharma</h1>
        <p>Gérez efficacement vos commandes et votre inventaire de médicaments</p>
        
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un médicament..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
      </header>

      <main className="home-main">
        <div className="dashboard-grid">
          {/* Section Aperçu Rapide */}
          <section className="quick-stats">
            <div className="stat-card">
              <FaPills className="stat-icon" />
              <div className="stat-info">
                <h3>428</h3>
                <p>Médicaments</p>
              </div>
            </div>
            <div className="stat-card">
              <FaClipboardList className="stat-icon" />
              <div className="stat-info">
                <h3>12</h3>
                <p>Commandes en cours</p>
              </div>
            </div>
            
            <div className="stat-card info">
              <FaCalendarAlt className="stat-icon" />
              <div className="stat-info">
                <h3>8</h3>
                <p>Livraisons prévues</p>
              </div>
            </div>
          </section>

          {/* Section Médicaments Récents */}
          <section className="recent-section medications">
            <div className="section-header">
              <h2>Médicaments récents</h2>
              <button onClick={() => navigate('/medicaments')} className="see-all-btn">
                Voir tout
              </button>
            </div>
            <div className="items-list">
              {recentMedications.map(med => (
                <div key={med.id} className="item-card hoverable" onClick={() => navigate(`/medicaments/${med.id}`)}>
                  <div className="item-info">
                    <h4>{med.name}</h4>
                    <p>Stock: {med.stock}</p>
                  </div>
                  <span className={`status-badge ${med.status === 'En stock' ? 'success' : 'warning'}`}>
                    {med.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section Commandes Récentes */}
          <section className="recent-section orders">
            <div className="section-header">
              <h2>Commandes récentes</h2>
              <button onClick={() => navigate('/orders')} className="see-all-btn">
                Voir tout
              </button>
            </div>
            <div className="items-list">
              {recentOrders.map(order => (
                <div key={order.id} className="item-card hoverable" onClick={() => navigate(`/orders/${order.id}`)}>
                  <div className="item-info">
                    <h4>{order.id}</h4>
                    <p>{order.date}</p>
                  </div>
                  <div className="order-details">
                    <span className="items-count">{order.items} articles</span>
                    <span className={`status-badge ${order.status === 'En cours' ? 'primary' : 'warning'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Section Actions Rapides */}
        <section className="quick-actions">
          <h2>Actions Rapides</h2>
          <div className="actions-grid">
            <button onClick={() => navigate('/medicaments')} className="action-button primary">
              <FaShoppingCart className="button-icon" />
              Nouvelle Commande
            </button>
            <button onClick={() => navigate('/orders')} className="action-button secondary">
              <FaClipboardList className="button-icon" />
              Voir les Commandes
            </button>
            <button onClick={() => navigate('/medicaments')} className="action-button tertiary">
              <FaPills className="button-icon" />
              Gérer l'Inventaire
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 