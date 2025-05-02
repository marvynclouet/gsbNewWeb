import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPills, FaClipboardList, FaShoppingCart, FaChartLine, FaSearch, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredMedications = [
    {
      id: 1,
      name: 'Doliprane 1000mg',
      description: 'Antalgique et antipyrétique',
      price: '5.99€',
      image: '/images/doliprane.jpg',
      stock: 150
    },
    {
      id: 2,
      name: 'Efferalgan 500mg',
      description: 'Antalgique et antipyrétique',
      price: '4.99€',
      image: '/images/efferalgan.jpg',
      stock: 120
    },
    {
      id: 3,
      name: 'Nurofen 400mg',
      description: 'Anti-inflammatoire non stéroïdien',
      price: '6.99€',
      image: '/images/ibuprofene.jpg',
      stock: 200
    }
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
        <p>Votre pharmacie en ligne de confiance</p>
        
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
        <section className="featured-medications">
          <div className="section-header">
            <h2>Nos Médicaments</h2>
            <button onClick={() => navigate('/medicaments')} className="see-all-btn">
              Voir tous les médicaments
            </button>
          </div>
          <div className="medications-grid">
            {
              featuredMedications.map(med => (
                <div key={med.id} className="medication-card">
                  <div className="medication-image">
                    <img src={med.image} alt={med.name} />
                  </div>
                  <div className="medication-info">
                    <h3>{med.name}</h3>
                    <p className="description">{med.description}</p>
                    <p className="price">{med.price}</p>
                    <span className={`stock-badge ${med.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {med.stock > 0 ? 'En stock' : 'Rupture de stock'}
                    </span>
                  </div>
                </div>
              ))
            }
          </div>
        </section>

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