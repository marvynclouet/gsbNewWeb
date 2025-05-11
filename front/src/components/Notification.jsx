import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import '../styles/Notification.css';

const Notification = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      <FaCheckCircle className="notification-icon" />
      <span>{message}</span>
    </div>
  );
};

export default Notification; 