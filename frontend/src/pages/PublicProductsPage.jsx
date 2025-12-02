import React, { useState, useEffect } from "react";

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
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900">Cargando productos...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Tienda Online</h1>
            <div className="flex items-center space-x-4">
              {customer ? (
                <>
                  <span className="text-gray-700">{customer.name}</span>
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => window.location.href = "/customer-login"} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Iniciar Sesión
                </button>
              )}
              <span className="text-gray-600">{cart.length} productos</span>
              {cart.length > 0 && (
                <button 
                  onClick={() => window.location.href = "/cart"} 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Ver Carrito
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Productos Disponibles</h2>
              <span className="text-gray-600">
                Página {currentPage} de {totalPages} ({filteredProducts.length} productos)
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map(product => (
                <div key={product.guidCode} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-1"><strong>SKU:</strong> {product.sku}</p>
                  {product.description && <p className="text-sm text-gray-600 mb-3">{product.description}</p>}
                  <p className="text-lg font-bold text-green-600 mb-1">${product.currentUnitPrice}</p>
                  <p className="text-sm text-gray-600 mb-4"><strong>Stock:</strong> {product.stockQuantity}</p>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number" 
                      min="1" 
                      defaultValue="1"
                      id={`qty-${product.guidCode}`}
                      className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button 
                      className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-200 ${
                        product.stockQuantity <= 0 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
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
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition duration-200"
                >
                  ← Anterior
                </button>
                <span className="text-gray-600">Página {currentPage} de {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition duration-200"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Carrito de Compras</h3>
              {cart.length === 0 ? (
                <p className="text-gray-600">El carrito está vacío</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.guidCode} className="border-b border-gray-200 pb-4">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">${item.currentUnitPrice || item.unitPrice} x {item.quantity}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => updateQuantity(item.guidCode, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.guidCode, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.guidCode)} 
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-xl font-bold text-gray-900 mb-4">
                      Total: ${getTotalPrice().toFixed(2)}
                    </div>
                    <button 
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-200"
                      onClick={handleCheckout}
                    >
                      {customer ? "Comprar" : "Iniciar Compra"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}