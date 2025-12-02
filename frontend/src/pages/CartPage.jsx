import React, { useState, useEffect } from "react";

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Carrito Vacío</h2>
          <p className="text-gray-600 mb-6">No tienes productos en tu carrito</p>
          <button 
            onClick={() => window.location.href = "/"} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Ir a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Productos</h3>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.guidCode} className="border-b border-gray-200 pb-4">
                <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                <p className="text-lg font-semibold text-green-600">
                  ${item.currentUnitPrice} x {item.quantity} = ${(item.currentUnitPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="text-2xl font-bold text-gray-900 mb-6">
              Total: ${getTotalPrice().toFixed(2)}
            </div>
            <button 
              onClick={handleCheckout} 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-200"
            >
              {localStorage.getItem("userData") && localStorage.getItem("userType") === "Customer" 
                ? "Finalizar Compra" 
                : "Iniciar Sesión para Comprar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}