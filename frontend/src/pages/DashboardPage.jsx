import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    window.location.href = "/"; 
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>🛠️ Dashboard Administrador</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <a href="/" style={{ color: "#4a90e2", textDecoration: "none" }}>
            🏠 Ver Tienda
          </a>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 15px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3>📦 Gestionar Productos</h3>
          <p>Crear, editar y eliminar productos del catálogo</p>
          <button style={{ padding: "10px 15px", background: "#4a90e2", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Ver Productos
          </button>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3>📈 Ver Órdenes</h3>
          <p>Revisar y gestionar las órdenes de los clientes</p>
          <button style={{ padding: "10px 15px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Ver Órdenes
          </button>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3>👥 Clientes</h3>
          <p>Ver información de los clientes registrados</p>
          <button style={{ padding: "10px 15px", background: "#17a2b8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Ver Clientes
          </button>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3>➕ Crear Producto</h3>
          <p>Agregar nuevos productos al catálogo</p>
          <button style={{ padding: "10px 15px", background: "#ffc107", color: "black", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Crear Producto
          </button>
        </div>
      </div>
    </div>
  );
}
