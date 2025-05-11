import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaPills, FaClipboardList, FaShoppingCart, FaChartLine, FaSearch, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import '../styles/Home.css';
import MedicamentDetail from '../components/MedicamentDetail';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const [selectedMedicament, setSelectedMedicament] = useState(null);
  const [featuredMedications, setFeaturedMedications] = useState([]);
  const [stats, setStats] = useState({
    medicaments: 0,
    commandes: 0,
    livraisons: 0
  });

  // Charger les médicaments en vedette depuis la base de données
  useEffect(() => {
    const fetchFeaturedMedications = async () => {
      try {
        const data = await api.getMedicaments();
        // Prendre les 3 premiers médicaments en stock
        const featured = data
          .filter(med => med.stock > 0)
          .slice(0, 3);
        setFeaturedMedications(featured);
      } catch (error) {
        console.error('Erreur lors du chargement des médicaments en vedette:', error);
      }
    };

    fetchFeaturedMedications();
  }, []);

  // Filtrage en temps réel
  useEffect(() => {
    if (searchQuery.trim()) {
      fetch(`http://localhost:5001/api/medicaments/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
          setShowDropdown(true);
        })
        .catch(() => {
          setSearchResults([]);
          setShowDropdown(false);
        });
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    console.log('ID utilisateur envoyé pour stats:', user.id);
    fetch(`http://localhost:5001/api/stats?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats({ medicaments: 0, commandes: 0, livraisons: 0 }));
  }, [user]);

  const handleAddToCart = (e, medicament) => {
    e.stopPropagation();
    addToCart(medicament);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bienvenue {user?.name || ''}</h1>
        <p>Votre pharmacie en ligne de confiance</p>
        
        <div className="search-bar-container" ref={searchRef}>
          <form
            onSubmit={e => e.preventDefault()}
            className={`search-bar-form${searchResults.length > 0 ? ' dropdown-open' : ''}`}
          >
            <input
              type="text"
              placeholder="Rechercher un médicament..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              className="search-bar-input"
              style={{
                flex: 1,
                padding: '18px 20px',
                borderRadius: '16px 0 0 16px',
                border: 'none',
                fontSize: '1.2rem',
                outline: 'none',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            />
            <button
              type="submit"
              className="search-bar-btn"
            >
              <FaSearch />
            </button>
          </form>
          {showDropdown && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map(med => (
                <div
                  key={med.id}
                  className="search-dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    setSelectedMedicament({
                      ...med,
                      name: med.name,
                      price: med.price,
                      image_url: med.image_url,
                      description: med.description,
                      stock: med.stock
                    });
                    setSearchQuery('');
                  }}
                >
                  <span className="result-name">{med.name}</span>
                  <span className="result-price">{med.price}€</span>
                  <span className={`stock-badge ${med.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {med.stock > 0 ? 'En stock' : 'Rupture de stock'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
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
            {featuredMedications.map(med => (
              <div 
                key={med.id} 
                className="medication-card"
                onClick={() => setSelectedMedicament(med)}
              >
                <div className="medication-image">
                  <img 
                    src={med.image_url || '/placeholder.png'} 
                    alt={med.name}
                    onError={(e) => e.target.src = '/placeholder.png'}
                  />
                </div>
                <div className="medication-info">
                  <h3>{med.name}</h3>
                  <p className="description">{med.description}</p>
                  <p className="price">{med.price}€</p>
                  <span className={`stock-badge ${med.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {med.stock > 0 ? 'En stock' : 'Rupture de stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="dashboard-grid">
          {/* Section Aperçu Rapide */}
          <section className="quick-stats">
            <div className="stat-card">
              <FaPills className="stat-icon" />
              <div className="stat-info">
                <h3>{stats.medicaments}</h3>
                <p>Médicaments</p>
              </div>
            </div>
            <div className="stat-card">
              <FaClipboardList className="stat-icon" />
              <div className="stat-info">
                <h3>{stats.commandes}</h3>
                <p>Commandes en cours</p>
              </div>
            </div>
            <div className="stat-card info">
              <FaCalendarAlt className="stat-icon" />
              <div className="stat-info">
                <h3>{stats.livraisons}</h3>
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
          </div>
        </section>
      </main>

      {selectedMedicament && (
        <MedicamentDetail
          medicament={selectedMedicament}
          onClose={() => setSelectedMedicament(null)}
          onAddToCart={(e) => handleAddToCart(e, selectedMedicament)}
        />
      )}
    </div>
  );
};

export default Home; 