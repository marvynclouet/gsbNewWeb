import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bienvenue sur GSB Pharma</h1>
        <p>Votre plateforme de gestion de commandes de médicaments</p>
      </header>

      <main className="home-main">
        <section className="features-section">
          <h2>Nos Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Commandes</h3>
              <p>Commandez facilement vos médicaments</p>
            </div>
            <div className="feature-card">
              <h3>Suivi</h3>
              <p>Suivez l'état de vos commandes en temps réel</p>
            </div>
            <div className="feature-card">
              <h3>Gestion</h3>
              <p>Gérez votre inventaire efficacement</p>
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <h2>Actions Rapides</h2>
          <div className="actions-grid">
            <button className="action-button">Nouvelle Commande</button>
            <button className="action-button">Voir les Commandes</button>
            <button className="action-button">Gérer l'Inventaire</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 