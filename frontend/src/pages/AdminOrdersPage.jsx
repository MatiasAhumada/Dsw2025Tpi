import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    
    if (!token || userType !== "Admin") {
      localStorage.clear();
      navigate("/login");
      return;
    }
    
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5142/api/orders", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        console.error("Error en la respuesta:", response.status);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="auth-container"><div className="auth-card"><h2>Cargando órdenes...</h2></div></div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>📈 Gestión de Órdenes</h1>
        <button 
          onClick={() => navigate("/admin")}
          style={{ padding: "10px 15px", background: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          ← Volver al Dashboard
        </button>
      </div>

      <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8f9fa" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Cliente</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Fecha</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Total</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Estado</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Productos</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderId} style={{ borderBottom: "1px solid #dee2e6" }}>
                <td style={{ padding: "12px" }}>{order.orderId.substring(0, 8)}...</td>
                <td style={{ padding: "12px" }}>{order.customerId.substring(0, 8)}...</td>
                <td style={{ padding: "12px" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "12px" }}>${order.totalAmount.toFixed(2)}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ 
                    padding: "4px 8px", 
                    borderRadius: "4px", 
                    fontSize: "12px",
                    background: order.status === "Pending" ? "#fff3cd" : "#d4edda",
                    color: order.status === "Pending" ? "#856404" : "#155724"
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  {order.orderItems.length} producto(s)
                  <details style={{ marginTop: "5px" }}>
                    <summary style={{ cursor: "pointer", fontSize: "12px", color: "#007bff" }}>Ver detalles</summary>
                    <div style={{ marginTop: "5px", fontSize: "12px" }}>
                      {order.orderItems.map(item => (
                        <div key={item.productId} style={{ padding: "2px 0" }}>
                          {item.name} - Qty: {item.quantity} - ${item.unitPrice}
                        </div>
                      ))}
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            No se encontraron órdenes
          </div>
        )}
      </div>
    </div>
  );
}