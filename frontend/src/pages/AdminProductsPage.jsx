import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";
import api from "../services/api";

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
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
      console.error("Error al decodificar token:", error);
      setUserName("Admin");
    }
    
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          
          if (role !== 'Admin') {
            localStorage.clear();
            navigate('/login');
            return;
          }
        } catch (e) {
          localStorage.clear();
          navigate('/login');
          return;
        }
      }
      
      const response = await api.get('/products/all');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableProduct = async (productId) => {
    if (!confirm("¿Estás seguro de deshabilitar este producto?")) return;
    
    try {
      await api.patch(`/products/${productId}`);
      fetchProducts();
      alert("Producto deshabilitado exitosamente");
    } catch (error) {
      console.error("Error al deshabilitar producto:", error);
      alert("Error de conexión: " + error.message);
    }
  };

  const handleEnableProduct = async (productId) => {
    if (!confirm("¿Estás seguro de activar este producto?")) return;
    
    try {
      await api.patch(`/products/${productId}`);
      fetchProducts();
      alert("Producto activado exitosamente");
    } catch (error) {
      console.error("Error al activar producto:", error);
      alert("Error de conexión: " + error.message);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && product.isActive) ||
                         (statusFilter === "inactive" && !product.isActive);
    return matchesSearch && matchesStatus;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return <div className="auth-container"><div className="auth-card"><h2>Cargando productos...</h2></div></div>;
  }

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/"; 
  }

  return (
    <div className="dashboard-layout">
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <h1 className="mobile-title">Productos</h1>
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
          <li className="active">
            <button onClick={() => { navigate("/admin/products"); setSidebarOpen(false); }}>
              Productos
            </button>
          </li>
          <li>
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
          <h2>Gestión de Productos</h2>
          <button 
            onClick={() => navigate("/admin/products/create")}
            className="btn-primary"
          >
            Crear Producto
          </button>
        </div>

        <div className="filters-section">
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
          <span className="results-info">
            Mostrando {currentProducts.length} de {filteredProducts.length} productos
          </span>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
            <tr>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
              {currentProducts.map(product => (
                <tr key={product.guidCode}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>${product.currentUnitPrice || product.unitPrice}</td>
                  <td>{product.stockQuantity || product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => navigate(`/admin/products/edit/${product.guidCode}`)}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      {product.isActive ? (
                        <button 
                          onClick={() => handleDisableProduct(product.guidCode)}
                          className="btn-disable"
                        >
                          Deshabilitar
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleEnableProduct(product.guidCode)}
                          className="btn-enable"
                        >
                          Activar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {currentProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-results">
                    No se encontraron productos
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