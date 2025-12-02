import React, { useState, useEffect } from "react";

export default function CheckoutForm() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Finalizar Compra</h1>
          <p className="text-gray-600">Revisa tu pedido y completa la información</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Resumen del pedido */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              Resumen del Pedido
            </h3>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.guidCode} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">${item.currentUnitPrice} x {item.quantity}</p>
                  </div>
                  <div className="text-lg font-semibold text-blue-600">
                    ${(item.currentUnitPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t-2 border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Información del cliente */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              Información del Cliente
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-semibold text-gray-800">{customer.name}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{customer.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de envío */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            Información de Envío
          </h3>
          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Envío
                </label>
                <textarea
                  value={orderData.shippingAddress}
                  onChange={(e) => setOrderData({...orderData, shippingAddress: e.target.value})}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  placeholder="Ingresa tu dirección de envío..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Facturación
                </label>
                <textarea
                  value={orderData.billingAddress}
                  onChange={(e) => setOrderData({...orderData, billingAddress: e.target.value})}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  placeholder="Ingresa tu dirección de facturación..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas adicionales (opcional)
              </label>
              <textarea
                value={orderData.notes}
                onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                placeholder="Instrucciones especiales, comentarios..."
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                type="button" 
                onClick={() => window.location.href = "/"} 
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Modificar Compra
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Procesando..." : `Completar Compra - $${getTotalPrice().toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}