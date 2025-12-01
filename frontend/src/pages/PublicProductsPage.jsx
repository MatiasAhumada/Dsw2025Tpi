import React, { useState, useEffect } from "react";
import "./Auth.css";
import "./PublicProductsPage.css";

export default function PublicProductsPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const userData = localStorage.getItem("userData");
    if (userData) {
      setCustomer(JSON.parse(userData));
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5142/api/products");
      
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } else {
        console.error("Error en la respuesta:", response.status);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product, quantity = 1) => {
    if (quantity < 1) {
      alert("La cantidad mínima es 1");
      return;
    }
    
    const existingItem = cart.find(item => item.guidCode === product.guidCode);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.guidCode === product.guidCode
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
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
    return cart.reduce((total, item) => total + (item.currentUnitPrice * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }
    
    if (customer) {
      window.location.href = "/checkout";
    } else {
      window.location.href = "/customer-login";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setCustomer(null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return <div className="auth-container"><div className="auth-card"><h2>Cargando productos...</h2></div></div>;
  }

  return (
    <div className="public-container">
      <div className="public-header">
        <h1>🛍️ Tienda Online</h1>
        <div className="header-actions">
          {customer ? (
            <>
              <span>👤 {customer.name}</span>
              <button onClick={handleLogout} className="header-btn logout">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button onClick={() => window.location.href = "/customer-login"} className="header-btn login">
              Iniciar Sesión
            </button>
          )}
          <span>🛒 {cart.length} productos</span>
          {cart.length > 0 && (
            <button onClick={() => window.location.href = "/cart"} className="header-btn cart">
              Ver Carrito
            </button>
          )}
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
      </div>

      <div className="main-grid">
        <div className="products-section">
          <div className="products-header">
            <h2>Productos Disponibles</h2>
            <span className="products-info">
              Página {currentPage} de {totalPages} ({filteredProducts.length} productos)
            </span>
          </div>
          
          <div className="products-grid">
            {currentProducts.map(product => (
              <div key={product.guidCode} className="product-card">
                <h3>{product.name}</h3>
                <p><strong>SKU:</strong> {product.sku}</p>
                {product.description && <p>{product.description}</p>}
                <p><strong>Precio:</strong> ${product.currentUnitPrice}</p>
                <p><strong>Stock:</strong> {product.stockQuantity}</p>
                <div className="product-actions">
                  <input 
                    type="number" 
                    min="1" 
                    defaultValue="1"
                    id={`qty-${product.guidCode}`}
                    className="quantity-input"
                  />
                  <button 
                    className="btn-primary add-btn"
                    onClick={() => {
                      const qty = parseInt(document.getElementById(`qty-${product.guidCode}`).value) || 1;
                      addToCart(product, qty);
                    }}
                    disabled={product.stockQuantity <= 0}
                  >
                    {product.stockQuantity <= 0 ? "Sin Stock" : "Agregar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Anterior
              </button>
              <span className="pagination-info">Página {currentPage} de {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>

        <div className="cart-section">
          <div className="cart-card">
            <h3>🛒 Carrito de Compras</h3>
            {cart.length === 0 ? (
              <p>El carrito está vacío</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.guidCode} className="cart-item">
                    <h4>{item.name}</h4>
                    <p>${item.currentUnitPrice || item.unitPrice} x {item.quantity}</p>
                    <div className="cart-item-actions">
                      <button onClick={() => updateQuantity(item.guidCode, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.guidCode, item.quantity + 1)}>+</button>
                      <button onClick={() => removeFromCart(item.guidCode)} className="remove-btn">
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                <div className="cart-total">
                  Total: ${getTotalPrice().toFixed(2)}
                </div>
                <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                  {customer ? "Comprar" : "Iniciar Compra"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}