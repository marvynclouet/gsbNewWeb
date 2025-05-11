import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implémenter l'envoi du formulaire
    console.log('Formulaire soumis:', formData);
    setNotification({
      show: true,
      message: 'Votre message a été envoyé avec succès !',
      type: 'success'
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  return (
    <div className="contact-container">
      <h1>Contactez-nous</h1>
      
      <div className="contact-content">
        <div className="contact-info">
          <h2>Nos Coordonnées</h2>
          
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <div>
              <h3>Adresse</h3>
              <p>123 Rue de la Santé<br />75000 Paris</p>
            </div>
          </div>

          <div className="info-item">
            <FaPhone className="info-icon" />
            <div>
              <h3>Téléphone</h3>
              <p>01 23 45 67 89</p>
            </div>
          </div>

          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <div>
              <h3>Email</h3>
              <p>contact@gsb-pharmacy.fr</p>
            </div>
          </div>

          <div className="info-item">
            <FaClock className="info-icon" />
            <div>
              <h3>Horaires d'ouverture</h3>
              <p>Lundi - Vendredi : 8h00 - 20h00</p>
              <p>Samedi : 9h00 - 18h00</p>
              <p>Dimanche : 9h00 - 13h00</p>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h2>Envoyez-nous un message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Votre nom"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Votre email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Sujet</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Le sujet de votre message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Votre message"
                rows="6"
              />
            </div>

            <button type="submit" className="submit-btn">
              Envoyer le message
            </button>
          </form>
        </div>
      </div>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Contact; 