import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("general");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    if (userType !== "Admin") {
      localStorage.clear();
      navigate("/login");
      return;
    }
    
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserName(payload.unique_name || "Admin");
    } catch (error) {
      console.error("Error al decodificar token:", error);
      setUserName("Admin");
    }
    
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      let productsCount = 0;
      let ordersCount = 0;
      
      try {
        const productsRes = await fetch("http://localhost:5142/api/products/all", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (productsRes.ok) {
          const products = await productsRes.json();
          productsCount = Array.isArray(products) ? products.length : 0;
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
      
      try {
        const ordersRes = await fetch("http://localhost:5142/api/orders", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          ordersCount = ordersData.totalCount || 0;
        } else {
          console.error("Error al obtener órdenes - Status:", ordersRes.status);
        }
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
      }
      
      setStats({
        products: productsCount,
        orders: ordersCount
      });
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login"; 
  }

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="content-section">
            <h2>Resumen General</h2>
            <div className="stats-grid">
              <div className="stat-card products">
                <h2 className="stat-number">{loading ? "..." : stats.products}</h2>
                <p className="stat-label">Productos en el Sistema</p>
                <button onClick={() => setActiveSection("productos")} className="stat-btn">
                  Ver Productos
                </button>
              </div>
              <div className="stat-card orders">
                <h2 className="stat-number">{loading ? "..." : stats.orders}</h2>
                <p className="stat-label">Órdenes en el Sistema</p>
                <button onClick={() => setActiveSection("ordenes")} className="stat-btn">
                  Ver Órdenes
                </button>
              </div>
            </div>
          </div>
        );
      case "productos":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Gestión de Productos</h2>
              <button onClick={() => navigate("/admin/products/create")} className="btn-primary">
                Crear Producto
              </button>
            </div>
            <div className="section-content">
              <div className="info-card">
                <h3>Total de Productos: {loading ? "..." : stats.products}</h3>
                <p>Administra tu catálogo de productos desde aquí</p>
                <button onClick={() => navigate("/admin/products")} className="btn-secondary">
                  Ver Todos los Productos
                </button>
              </div>
            </div>
          </div>
        );
      case "ordenes":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Gestión de Órdenes</h2>
            </div>
            <div className="section-content">
              <div className="info-card">
                <h3>Total de Órdenes: {loading ? "..." : stats.orders}</h3>
                <p>Revisa y gestiona las órdenes de los clientes</p>
                <button onClick={() => navigate("/admin/orders")} className="btn-secondary">
                  Ver Todas las Órdenes
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <ul className="nav-menu">
          <li className={activeSection === "general" ? "active" : ""}>
            <button onClick={() => setActiveSection("general")}>
              General
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/admin/products")}>
              Productos
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/admin/orders")}>
              Órdenes
            </button>
          </li>
        </ul>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{userName}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}