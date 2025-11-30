import React, { useState, useEffect } from "react";
import "./Auth.css";

export default function PublicProductsPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    // Cargar carrito del localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5142/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.guidCode === product.guidCode);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.guidCode === product.guidCode
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.guidCode !== productId);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const newCart = cart.map(item =>
      item.guidCode === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }
    // Redirigir al login de customer para comprar
    window.location.href = "/customer-login";
  };

  if (loading) {
    return <div className="auth-container"><div className="auth-card"><h2>Cargando productos...</h2></div></div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>🛍️ Tienda Online</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <span>🛒 {cart.length} productos</span>
          <a href="/login" style={{ color: "#4a90e2", textDecoration: "none" }}>
            👤 Admin Login
          </a>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
        {/* Productos */}
        <div>
          <h2>Productos Disponibles</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
            {products.map(product => (
              <div key={product.guidCode} className="dashboard-card">
                <h3>{product.name}</h3>
                <p><strong>SKU:</strong> {product.sku}</p>
                <p>{product.description}</p>
                <p><strong>Precio:</strong> ${product.unitPrice}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <button 
                  className="btn-primary"
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0 ? "Sin Stock" : "Agregar al Carrito"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito */}
        <div>
          <div className="dashboard-card">
            <h3>🛒 Carrito de Compras</h3>
            {cart.length === 0 ? (
              <p>El carrito está vacío</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.guidCode} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
                    <h4>{item.name}</h4>
                    <p>${item.unitPrice} x {item.quantity}</p>
                    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                      <button onClick={() => updateQuantity(item.guidCode, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.guidCode, item.quantity + 1)}>+</button>
                      <button onClick={() => removeFromCart(item.guidCode)} style={{ marginLeft: "10px", color: "red" }}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: "15px", fontSize: "18px", fontWeight: "bold" }}>
                  Total: ${getTotalPrice().toFixed(2)}
                </div>
                <button 
                  className="btn-primary" 
                  onClick={handleCheckout}
                  style={{ width: "100%", marginTop: "15px" }}
                >
                  Comprar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}