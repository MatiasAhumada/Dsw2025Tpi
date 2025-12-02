import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../shared/services/api";

export default function DashboardForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("general");
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserName(payload.unique_name || "Admin");
    } catch (error) {
      setUserName("Admin");
    }
    
    fetchStats();
  }, [location.state]);

  const fetchStats = async () => {
    try {
      let productsCount = 0;
      let ordersCount = 0;
      
      try {
        const productsRes = await api.get('/products/all');
        productsCount = Array.isArray(productsRes.data) ? productsRes.data.length : 0;
      } catch (error) {}
      
      try {
        const ordersRes = await api.get('/orders');
        ordersCount = ordersRes.data.totalCount || 0;
      } catch (error) {}
      
      setStats({
        products: productsCount,
        orders: ordersCount
      });
    } catch (error) {
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
              <div className="stat-card users">
                <h2 className="stat-number">Usuarios</h2>
                <p className="stat-label">Gestión de Usuarios</p>
                <button onClick={() => setActiveSection("usuarios")} className="stat-btn">
                  Administrar
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
      case "usuarios":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Gestión de Usuarios</h2>
            </div>
            <div className="section-content">
              <div className="info-card">
                <h3>Administrar Usuarios del Sistema</h3>
                <p>Crear nuevo administrador o cliente</p>
                <button onClick={() => navigate("/admin/signup")} className="btn-secondary">
                  Registrar Nuevo Usuario
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
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <h1 className="mobile-title">Admin Panel</h1>
      </div>
      
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <ul className="nav-menu">
          <li className={activeSection === "general" ? "active" : ""}>
            <button onClick={() => { setActiveSection("general"); setSidebarOpen(false); }}>
              General
            </button>
          </li>
          <li>
            <button onClick={() => { navigate("/admin/products"); setSidebarOpen(false); }}>
              Productos
            </button>
          </li>
          <li>
            <button onClick={() => { navigate("/admin/orders"); setSidebarOpen(false); }}>
              Órdenes
            </button>
          </li>
          <li className={activeSection === "usuarios" ? "active" : ""}>
            <button onClick={() => { setActiveSection("usuarios"); setSidebarOpen(false); }}>
              Usuarios
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