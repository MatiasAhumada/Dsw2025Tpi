import React, { useState, useEffect } from "react";
import "./Auth.css";
import "./CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.currentUnitPrice * item.quantity), 0);
  };

  const handleCheckout = () => {
    window.location.href = "/customer-login";
  };

  if (cart.length === 0) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Carrito Vacío</h2>
          <p>No tienes productos en tu carrito</p>
          <button onClick={() => window.location.href = "/"} className="btn-primary">
            Ir a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>🛒 Carrito de Compras</h1>

      <div className="cart-summary">
        <h3>Productos</h3>
        {cart.map(item => (
          <div key={item.guidCode} className="cart-product">
            <h4>{item.name}</h4>
            <p>SKU: {item.sku}</p>
            <p>Precio: ${item.currentUnitPrice} x {item.quantity} = ${(item.currentUnitPrice * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="cart-total">
          Total: ${getTotalPrice().toFixed(2)}
        </div>
        <button onClick={handleCheckout} className="btn-primary proceed-btn">
          Proceder al Checkout
        </button>
      </div>
    </div>
  );
}