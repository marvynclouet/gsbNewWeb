import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import MedicamentDetail from '../components/MedicamentDetail';
import '../styles/Medicaments.css';

const Medicaments = () => {
  const { addToCart } = useCart();
  const [medicaments, setMedicaments] = useState([]);
  const [filteredMedicaments, setFilteredMedicaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedicament, setSelectedMedicament] = useState(null);

  useEffect(() => {
    const fetchMedicaments = async () => {
      try {
        const data = await api.getMedicaments();
        setMedicaments(data);
        setFilteredMedicaments(data);
      } catch (err) {
        setError('Erreur lors du chargement des médicaments');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicaments();
  }, []);

  useEffect(() => {
    const filtered = medicaments.filter(medicament => 
      medicament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicament.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicaments(filtered);
  }, [searchTerm, medicaments]);

  const handleMedicamentClick = (medicament) => {
    setSelectedMedicament(medicament);
  };

  const handleCloseDetail = () => {
    setSelectedMedicament(null);
  };

  const handleAddToCart = (e, medicament) => {
    e.stopPropagation();
    addToCart(medicament);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="medicaments-container">
      <h1>Nos Médicaments</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher un médicament..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <div className="search-results">
          {filteredMedicaments.length} médicament(s) trouvé(s)
        </div>
      </div>

      <div className="medicaments-list">
        <div className="list-header">
          <div className="header-item image">Image</div>
          <div className="header-item nom">Nom</div>
          <div className="header-item description">Description</div>
          <div className="header-item prix">Prix</div>
          <div className="header-item stock">Stock</div>
          <div className="header-item action">Action</div>
        </div>
        {filteredMedicaments.map((medicament) => (
          <div 
            key={medicament.id} 
            className="medicament-row"
            onClick={() => handleMedicamentClick(medicament)}
          >
            <div className="list-item image">
              <img 
                src={medicament.image_url || '/placeholder.png'} 
                alt={medicament.name}
                onError={(e) => e.target.src = '/placeholder.png'}
              />
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
                onClick={(e) => handleAddToCart(e, medicament)}
              >
                {medicament.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMedicament && (
        <MedicamentDetail
          medicament={selectedMedicament}
          onClose={handleCloseDetail}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Medicaments; 