import React from 'react';
import { Link } from 'react-router-dom';
import { FaPills, FaUsers, FaShoppingCart, FaChartBar } from 'react-icons/fa';
import '../../styles/Admin.css';

const Dashboard = () => {
  const cards = [
    {
      title: 'Gestion des Médicaments',
      description: 'Ajouter, modifier ou supprimer des médicaments du catalogue',
      icon: <FaPills />,
      link: '/admin/medicaments',
      color: '#2196F3'
    },
    {
      title: 'Gestion des Utilisateurs',
      description: 'Gérer les comptes utilisateurs et leurs rôles',
      icon: <FaUsers />,
      link: '/admin/users',
      color: '#4CAF50'
    },
    {
      title: 'Gestion des Commandes',
      description: 'Suivre et gérer les commandes des clients',
      icon: <FaShoppingCart />,
      link: '/admin/orders',
      color: '#FF9800'
    },
    
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Tableau de Bord Administrateur</h1>
      </div>

      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <Link to={card.link} key={index} className="dashboard-card" style={{
            '--card-color': card.color
          }}>
            <div className="card-icon" style={{ backgroundColor: card.color }}>
              {card.icon}
            </div>
            <div className="card-content">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
            <div className="card-arrow">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5 12H19M19 12L12 5M19 12L12 19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 