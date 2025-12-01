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

  const validateCartProducts = async () => {
    try {
      const response = await fetch("http://localhost:5142/api/products");
      if (!response.ok) return false;
      
      const activeProducts = await response.json();
      const updatedCart = [];
      let hasChanges = false;
      
      for (const cartItem of cart) {
        const currentProduct = activeProducts.find(p => p.guidCode === cartItem.guidCode);
        
        if (!currentProduct || !currentProduct.isActive) {
          alert(`El producto "${cartItem.name}" ya no está disponible y fue removido del carrito.`);
          hasChanges = true;
          continue;
        }
        
        if (currentProduct.stockQuantity < cartItem.quantity) {
          alert(`El producto "${cartItem.name}" solo tiene ${currentProduct.stockQuantity} unidades disponibles. Se ajustó la cantidad.`);
          updatedCart.push({ ...cartItem, quantity: currentProduct.stockQuantity });
          hasChanges = true;
        } else {
          updatedCart.push(cartItem);
        }
      }
      
      if (hasChanges) {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error validando productos:", error);
      alert("Error al validar productos. Intenta nuevamente.");
      return false;
    }
  };

  const handleCheckout = async () => {
    const isValid = await validateCartProducts();
    if (!isValid) return;
    
    const userData = localStorage.getItem("userData");
    const userType = localStorage.getItem("userType");
    
    if (userData && userType === "Customer") {
      window.location.href = "/checkout";
    } else {
      window.location.href = "/customer-login";
    }
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
      <h1>Carrito de Compras</h1>

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
          {localStorage.getItem("userData") && localStorage.getItem("userType") === "Customer" 
            ? "Finalizar Compra" 
            : "Iniciar Sesión para Comprar"}
        </button>
      </div>
    </div>
  );
}