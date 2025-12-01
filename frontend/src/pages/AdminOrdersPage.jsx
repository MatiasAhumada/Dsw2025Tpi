import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";
import api from "../services/api";

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTimeout, setSearchTimeout] = useState(null);

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
      const params = {
        pageNumber: currentPage,
        pageSize: ordersPerPage
      };
      
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      
      if (search.trim()) {
        params.search = search.trim();
      }
      
      const response = await api.get('/orders', { params });
      
      setOrders(Array.isArray(response.data.data) ? response.data.data : []);
      setTotalPages(response.data.totalPages || 0);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
      setOrders([]);
      setTotalPages(0);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchOrders();
    }, 500);
    
    setSearchTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);



  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login"; 
  }

  if (loading) {
    return <div className="auth-container"><div className="auth-card"><h2>Cargando órdenes...</h2></div></div>;
  }

  return (
    <div className="dashboard-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <ul className="nav-menu">
          <li>
            <button onClick={() => navigate("/admin")}>
              General
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/admin/products")}>
              Productos
            </button>
          </li>
          <li className="active">
            <button onClick={() => navigate("/admin/orders")}>
              Órdenes
            </button>
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        <div className="section-header">
          <h2>Gestión de Órdenes</h2>
        </div>

        <div className="filters-section">
          <input
            type="text"
            placeholder="Buscar por ID de orden, cliente o por total..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="all">Todos los estados</option>
            <option value="Pending">Pendiente</option>
            <option value="Processing">Procesando</option>
            <option value="Shipped">Enviado</option>
            <option value="Delivered">Entregado</option>
            <option value="Cancelled">Cancelado</option>
          </select>
          <span className="results-info">
            Mostrando {orders.length} de {totalCount} órdenes (Página {currentPage} de {totalPages})
          </span>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orderId}>
                  <td>{order.orderId.substring(0, 8)}...</td>
                  <td>{order.customerId.substring(0, 8)}...</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
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
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-results">
                    No se encontraron órdenes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
            
            <span className="pagination-info">
              Página {currentPage} de {totalPages}
            </span>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Siguiente →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}