import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../styles/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <p>Votre panier est vide</p>
        <button onClick={() => navigate('/medicaments')}>Retour aux médicaments</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Votre Panier</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image_url || '/placeholder.png'} alt={item.name} />
            </div>
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="cart-item-price">{formatPrice(item.price)}€</p>
            </div>
            <div className="cart-item-quantity">
              <button 
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="quantity-btn"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="remove-btn"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: {formatPrice(getTotal())}€</h3>
        <button 
          className="checkout-btn"
          onClick={() => navigate('/checkout')}
        >
          Procéder au paiement
        </button>
      </div>
    </div>
  );
};

export default Cart; 