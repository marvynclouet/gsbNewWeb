import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaPills, FaEnvelope, FaShoppingCart, FaUser, FaListAlt, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';
import logo from '../assets/1 (1).png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className={`navbar${menuOpen ? ' active' : ''}`}>
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="GSB Pharmacy" className="navbar-logo" />
        </Link>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Ouvrir le menu"
      >
        <span className="burger-bar"></span>
        <span className="burger-bar"></span>
        <span className="burger-bar"></span>
      </button>

      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
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
        {user ? (
          <>
            <li>
              <Link to="/cart" className={isActive('/cart') ? 'active' : ''}>
                <FaShoppingCart /> Panier
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
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
            {user.role === 'admin' && (
              <li>
                <Link to="/admin" className="admin-link">
                  Administration
                </Link>
              </li>
            )}
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                <FaUser /> Connexion
              </Link>
            </li>
            <li>
              <Link to="/register" className={isActive('/register') ? 'active' : ''}>
                Inscription
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; 