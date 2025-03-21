import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaPills, FaEnvelope, FaShoppingCart, FaUser, FaListAlt, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserCog } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';
import logo from '../assets/1 (1).png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items = [] } = useCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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

  const cartItemCount = Array.isArray(items) ? items.reduce((total, item) => total + (item?.quantity || 0), 0) : 0;

  return (
    <nav className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="GSB Pharmacy" className="navbar-logo" />
        </Link>
        <button className="collapse-toggle" onClick={toggleCollapse} title={isCollapsed ? "Étendre" : "Rétracter"}>
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <button className="menu-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            <FaHome /> {!isCollapsed && <span>Accueil</span>}
          </Link>
        </li>
        <li>
          <Link to="/medicaments" className={isActive('/medicaments') ? 'active' : ''}>
            <FaPills /> {!isCollapsed && <span>Médicaments</span>}
          </Link>
        </li>
        <li>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
            <FaEnvelope /> {!isCollapsed && <span>Contact</span>}
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/cart" className={isActive('/cart') ? 'active' : ''}>
                <FaShoppingCart /> 
                {!isCollapsed && <span>Panier</span>}
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>
            </li>
            <li>
              <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>
                <FaListAlt /> {!isCollapsed && <span>Mes Commandes</span>}
              </Link>
            </li>
            <li>
              <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
                <FaUser /> {!isCollapsed && <span>Profil</span>}
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> {!isCollapsed && <span>Déconnexion</span>}
              </button>
            </li>
            {user.role === 'admin' && (
              <li>
                <Link to="/admin" className="admin-link">
                  <FaUserCog /> {!isCollapsed && <span>Administration</span>}
                </Link>
              </li>
            )}
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                <FaUser /> {!isCollapsed && <span>Connexion</span>}
              </Link>
            </li>
            <li>
              <Link to="/register" className={isActive('/register') ? 'active' : ''}>
                <FaUser /> {!isCollapsed && <span>Inscription</span>}
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; 