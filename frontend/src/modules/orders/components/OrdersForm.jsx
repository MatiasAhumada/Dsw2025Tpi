import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../shared/services/api";

export default function OrdersForm() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    
    if (!token || userType !== "Admin") {
      localStorage.clear();
      navigate("/login");
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserName(payload.unique_name || "Admin");
    } catch (error) {
      setUserName("Admin");
    }
    
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      const ordersData = response.data.data || response.data;
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const orderId = order.orderId || order.OrderId || '';
    const customerName = order.customerName || order.CustomerName || '';
    const totalAmount = order.totalAmount || order.TotalAmount || 0;
    const status = order.status || order.Status || '';
    
    const matchesSearch = orderId.toString().includes(search) ||
                         customerName.toLowerCase().includes(search.toLowerCase()) ||
                         totalAmount.toString().includes(search);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const copyToClipboard = async (orderId) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedId(orderId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      
    }
  };



  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login"; 
  }

  if (loading) {
    return <div className="auth-container"><div className="auth-card"><h2>Cargando órdenes...</h2></div></div>;
  }

  return (
    <div className="dashboard-layout">
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <h1 className="mobile-title">Órdenes</h1>
      </div>
      
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <ul className="nav-menu">
          <li>
            <button onClick={() => { navigate("/admin"); setSidebarOpen(false); }}>
              General
            </button>
          </li>
          <li>
            <button onClick={() => { navigate("/admin/products"); setSidebarOpen(false); }}>
              Productos
            </button>
          </li>
          <li className="active">
            <button onClick={() => { navigate("/admin/orders"); setSidebarOpen(false); }}>
              Órdenes
            </button>
          </li>
          <li>
            <button onClick={() => { navigate("/admin", { state: { activeSection: "usuarios" } }); setSidebarOpen(false); }}>
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
        <div className="section-header">
          <h2>Gestión de Órdenes</h2>
        </div>

        <div className="filters-section">
          <input
            type="text"
            placeholder="Buscar por ID de orden, cliente o por total..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            Mostrando {currentOrders.length} de {filteredOrders.length} órdenes
          </span>
        </div>

        <div className="orders-list">
          {currentOrders.map(order => {
            const orderId = order.orderId || order.OrderId;
            const customerName = order.customerName || order.CustomerName;
            const customerId = order.customerId || order.CustomerId;
            const status = order.status || order.Status;
            const totalAmount = order.totalAmount || order.TotalAmount;
            const createdAt = order.createdAt || order.CreatedAt;
            const orderItems = order.orderItems || order.OrderItems || [];
            
            return (
            <div key={orderId} className="order-card">
              <div className="order-summary">
                <div className="customer-info">
                  <h3 className="customer-name">
                    Cliente: {customerName || `Usuario ${customerId?.substring(0, 8)}...`}
                  </h3>
                  <span className={`status-badge ${status?.toLowerCase()}`}>
                    {status}
                  </span>
                </div>
                <button 
                  onClick={() => setExpandedOrder(expandedOrder === orderId ? null : orderId)}
                  className="btn-secondary"
                >
                  {expandedOrder === orderId ? 'Ocultar' : 'Ver'}
                </button>
              </div>
              
              {expandedOrder === orderId && (
                <div className="order-details">
                  <div className="detail-row">
                    <strong>ID Orden:</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>{orderId}</span>
                      <button
                        onClick={() => copyToClipboard(orderId)}
                        className="btn-edit"
                        style={{ padding: '2px 6px', fontSize: '10px' }}
                        title="Copiar ID completo"
                      >
                        {copiedId === orderId ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
                  <div className="detail-row">
                    <strong>ID Cliente:</strong>
                    <span>{customerId}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Fecha:</strong>
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Total:</strong>
                    <span>${totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Estado:</strong>
                    <span className={`status-badge ${status?.toLowerCase()}`}>
                      {status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Productos ({orderItems.length}):</strong>
                    <div className="products-list">
                      {orderItems.map(item => (
                        <div key={item.productId || item.ProductId} className="product-item">
                          {item.name || item.Name} - Cantidad: {item.quantity || item.Quantity} - ${item.unitPrice || item.UnitPrice}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            );
          })}
          {currentOrders.length === 0 && (
            <div className="no-results">
              {orders.length === 0 ? 'No hay órdenes disponibles' : 'No se encontraron órdenes con los filtros aplicados'}
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