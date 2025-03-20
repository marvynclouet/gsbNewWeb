import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { items = [], removeFromCart, updateQuantity } = useCart();

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!items || items.length === 0) {
    return (
      <div className="cart-container">
        <h2>Votre Panier</h2>
        <div className="cart-empty">
          <p>Votre panier est vide</p>
          <button onClick={() => navigate('/medicaments')}>
            Continuer vos achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Votre Panier</h2>
      <div className="cart-items">
        {items.map((item) => {
          const price = parseFloat(item.price) || 0;
          return (
            <div key={item.id} className="cart-item">
              <img 
                src={item.image_url || '/placeholder.png'} 
                alt={item.name || 'Produit'} 
                className="item-image" 
              />
              <div className="item-details">
                <h3>{item.name || 'Produit sans nom'}</h3>
                <p className="item-price">{price.toFixed(2)} €</p>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity || 1}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Supprimer
              </button>
            </div>
          );
        })}
      </div>
      <div className="cart-summary">
        <div className="total">
          <span>Total:</span>
          <span>{calculateTotal().toFixed(2)} €</span>
        </div>
        <button onClick={handleCheckout} className="checkout-btn">
          Passer la commande
        </button>
      </div>
    </div>
  );
};

export default Cart; 