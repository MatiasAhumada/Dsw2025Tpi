import React, { useState, useEffect } from "react";

export default function PublicProductsForm() {
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
      window.location.href = "/cart";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-500 to-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-black">
              Tienda Online
            </h1>
            <div className="flex items-center space-x-4">
              {customer ? (
                <>
                  <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <span className="text-blue-600 font-medium">{customer.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 transform hover:scale-105"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => window.location.href = "/customer-login"} 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 transform hover:scale-105"
                >
                  Iniciar Sesión
                </button>
              )}

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos por nombre o SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-lg transition duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Productos Disponibles</h2>
              <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                <span className="text-gray-600 font-medium">
                  Página {currentPage} de {totalPages} • {filteredProducts.length} productos
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map(product => (
                <div key={product.guidCode} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105 border-l-4 border-blue-500">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.sku}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        product.stockQuantity > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.stockQuantity > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Stock: {product.stockQuantity}
                      </span>
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-600 mb-2">${product.currentUnitPrice}</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number" 
                      min="1" 
                      max={product.stockQuantity}
                      defaultValue="1"
                      id={`qty-${product.guidCode}`}
                      className="w-16 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-medium"
                    />
                    <button 
                      className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition duration-200 ${
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
          
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition duration-200 font-medium shadow-md"
                >
                  ← Anterior
                </button>
                <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                  <span className="text-gray-600 font-medium">Página {currentPage} de {totalPages}</span>
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition duration-200 font-medium shadow-md"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>

          {/* Shopping Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                Carrito de Compras
              </h3>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 font-medium">El carrito está vacío</p>
                  <p className="text-sm text-gray-400 mt-2">Agrega productos para comenzar</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.guidCode} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-600">${item.currentUnitPrice || item.unitPrice} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-gray-800">Cant: {item.quantity}</span>
                          <button 
                            onClick={() => removeFromCart(item.guidCode)} 
                            className="w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded hover:bg-red-200 transition duration-200 text-sm font-bold"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-gray-200 pt-6">
                    <div className="text-2xl font-bold text-gray-800 mb-6 text-center">
                      Total: ${getTotalPrice().toFixed(2)}
                    </div>
                    <button 
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg"
                      onClick={handleCheckout}
                    >
                      {customer ? "Finalizar Compra" : "Iniciar Compra"}
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