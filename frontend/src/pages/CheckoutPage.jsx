import React, { useState, useEffect } from "react";
import "./Auth.css";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [orderData, setOrderData] = useState({
    shippingAddress: "",
    billingAddress: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const userData = localStorage.getItem("userData");
    const token = localStorage.getItem("token");
    if (userData && token) {
      setCustomer(JSON.parse(userData));
    } else {
      window.location.href = "/customer-login";
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
          alert(`El producto "${cartItem.name}" ya no está disponible. No se puede completar la compra.`);
          return false;
        }
        
        if (currentProduct.stockQuantity < cartItem.quantity) {
          alert(`El producto "${cartItem.name}" solo tiene ${currentProduct.stockQuantity} unidades disponibles. No se puede completar la compra de ${cartItem.quantity} unidades.`);
          return false;
        }
        
        updatedCart.push(cartItem);
      }
      
      return true;
    } catch (error) {
      console.error("Error validando productos:", error);
      alert("Error al validar productos. Intenta nuevamente.");
      return false;
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isValid = await validateCartProducts();
    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const orderRequest = {
        customerId: customer.guidCode,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        notes: orderData.notes,
        orderItems: cart.map(item => ({
          productId: item.guidCode,
          quantity: item.quantity
        }))
      };

      const response = await fetch("http://localhost:5142/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderRequest)
      });

      if (response.ok) {
        const order = await response.json();
        alert(`¡Orden creada exitosamente! ID: ${order.orderId}`);
        localStorage.removeItem("cart");
        window.location.href = "/";
      } else {
        const error = await response.json();
        alert(error.error || "Error al crear la orden");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="checkout-container">
      <h1>Finalizar Compra</h1>

      <div className="checkout-card">
        <h3>Resumen del Pedido</h3>
        {cart.map(item => (
          <div key={item.guidCode} className="order-item">
            <h4>{item.name}</h4>
            <p>${item.currentUnitPrice} x {item.quantity} = ${(item.currentUnitPrice * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="order-total">
          Total: ${getTotalPrice().toFixed(2)}
        </div>
      </div>

      <div className="checkout-card">
        <h3>Cliente</h3>
        <p><strong>Nombre:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
      </div>

      <div className="checkout-card">
        <h3>Información de Envío</h3>
        <form onSubmit={handleCheckout}>
          <div className="form-group">
            <label>Dirección de Envío:</label>
            <textarea
              value={orderData.shippingAddress}
              onChange={(e) => setOrderData({...orderData, shippingAddress: e.target.value})}
              required
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Dirección de Facturación:</label>
            <textarea
              value={orderData.billingAddress}
              onChange={(e) => setOrderData({...orderData, billingAddress: e.target.value})}
              required
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Notas (opcional):</label>
            <textarea
              value={orderData.notes}
              onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
              rows="2"
            />
          </div>
          <div className="checkout-actions">
            <button type="button" onClick={() => window.location.href = "/"} className="btn-secondary">
              Modificar Compra
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Procesando..." : `Completar Compra - $${getTotalPrice().toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}