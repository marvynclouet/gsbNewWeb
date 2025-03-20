import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contactez-nous</h1>
      <div className="contact-content">
        <div className="contact-info">
          <h2>Informations</h2>
          <p>Email: contact@gsb-pharma.com</p>
          <p>Téléphone: 01 23 45 67 89</p>
          <p>Adresse: 123 Rue de la Santé, 75000 Paris</p>
        </div>
        <form className="contact-form">
          <h2>Envoyez-nous un message</h2>
          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          <button type="submit" className="submit-btn">Envoyer</button>
        </form>
      </div>
    </div>
  );
};

export default Contact; 