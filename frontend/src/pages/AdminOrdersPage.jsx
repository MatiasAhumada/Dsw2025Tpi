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
  const [copiedId, setCopiedId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

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

  const copyToClipboard = async (orderId) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedId(orderId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
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

        <div className="orders-list">
          {orders.map(order => (
            <div key={order.orderId} className="order-card">
              <div className="order-summary">
                <div className="customer-info">
                  <h3 className="customer-name">
                    Cliente: {order.customerName || `Usuario ${order.customerId.substring(0, 8)}...`}
                  </h3>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <button 
                  onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                  className="btn-secondary"
                >
                  {expandedOrder === order.orderId ? 'Ocultar' : 'Ver'}
                </button>
              </div>
              
              {expandedOrder === order.orderId && (
                <div className="order-details">
                  <div className="detail-row">
                    <strong>ID Orden:</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>{order.orderId}</span>
                      <button
                        onClick={() => copyToClipboard(order.orderId)}
                        className="btn-edit"
                        style={{ padding: '2px 6px', fontSize: '10px' }}
                        title="Copiar ID completo"
                      >
                        {copiedId === order.orderId ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
                  <div className="detail-row">
                    <strong>ID Cliente:</strong>
                    <span>{order.customerId}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Fecha:</strong>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Total:</strong>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Estado:</strong>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Productos ({order.orderItems.length}):</strong>
                    <div className="products-list">
                      {order.orderItems.map(item => (
                        <div key={item.productId} className="product-item">
                          {item.name} - Cantidad: {item.quantity} - ${item.unitPrice}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {orders.length === 0 && (
            <div className="no-results">
              No se encontraron órdenes
            </div>
          )}
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