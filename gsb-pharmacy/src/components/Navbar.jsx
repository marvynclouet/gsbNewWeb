import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaPills, FaEnvelope, FaShoppingCart, FaUser, FaListAlt, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { items = [] } = useCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">GSB Pharmacy</Link>
      </div>

      <button className="menu-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            <FaHome /> Accueil
          </Link>
        </li>
        <li>
          <Link to="/medicaments" className={isActive('/medicaments') ? 'active' : ''}>
            <FaPills /> Médicaments
          </Link>
        </li>
        <li>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
            <FaEnvelope /> Contact
          </Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/cart" className={isActive('/cart') ? 'active' : ''}>
                <FaShoppingCart /> Panier
                {items.length > 0 && <span className="cart-count">{items.length}</span>}
              </Link>
            </li>
            <li>
              <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>
                <FaListAlt /> Mes Commandes
              </Link>
            </li>
            <li>
              <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
                <FaUser /> Profil
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> Déconnexion
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" className={isActive('/login') ? 'active' : ''}>
              <FaUser /> Connexion
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; 