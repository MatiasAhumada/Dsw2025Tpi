import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DashboardPage.css";

export default function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    sku: "",
    internalCode: "",
    name: "",
    description: "",
    currentUnitPrice: "",
    stockQuantity: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    
    if (!token || userType !== "Admin") {
      localStorage.clear();
      navigate("/login");
      return;
    }
    
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5142/api/products/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const product = await response.json();
        setFormData({
          sku: product.sku || "",
          internalCode: product.internalCode || "",
          name: product.name || "",
          description: product.description || "",
          currentUnitPrice: product.currentUnitPrice?.toString() || "",
          stockQuantity: product.stockQuantity?.toString() || ""
        });
      } else {
        alert("Error al cargar el producto");
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
      navigate("/admin/products");
    } finally {
      setLoadingProduct(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sku.trim()) {
      newErrors.sku = "El SKU es requerido";
    }

    if (!formData.internalCode.trim()) {
      newErrors.internalCode = "El código interno es requerido";
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.currentUnitPrice || parseFloat(formData.currentUnitPrice) < 0) {
      newErrors.currentUnitPrice = "El precio debe ser mayor o igual a 0";
    }

    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = "El stock debe ser mayor o igual a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5142/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          sku: formData.sku,
          internalCode: formData.internalCode,
          name: formData.name,
          description: formData.description || "",
          currentUnitPrice: parseFloat(formData.currentUnitPrice),
          stockQuantity: parseInt(formData.stockQuantity)
        })
      });

      if (response.ok) {
        alert("Producto actualizado exitosamente");
        navigate("/admin/products");
      } else {
        const error = await response.json();
        alert(error.message || "Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  if (loadingProduct) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Cargando producto...</h2>
      </div>
    );
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    window.location.href = "/"; 
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
          <li className="active">
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
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        <div className="section-header">
          <h2>Editar Producto</h2>
          <button 
            onClick={() => navigate("/admin/products")}
            className="btn-secondary"
          >
            ← Volver al Listado
          </button>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              SKU *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              style={{ 
                width: "100%", 
                padding: "10px", 
                borderRadius: "5px", 
                border: errors.sku ? "1px solid #dc3545" : "1px solid #ccc",
                boxSizing: "border-box"
              }}
              placeholder="Código único del producto"
            />
            {errors.sku && <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.sku}</span>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Código Interno *
            </label>
            <input
              type="text"
              name="internalCode"
              value={formData.internalCode}
              onChange={handleChange}
              style={{ 
                width: "100%", 
                padding: "10px", 
                borderRadius: "5px", 
                border: errors.internalCode ? "1px solid #dc3545" : "1px solid #ccc",
                boxSizing: "border-box"
              }}
              placeholder="Código único de identificación"
            />
            {errors.internalCode && <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.internalCode}</span>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ 
                width: "100%", 
                padding: "10px", 
                borderRadius: "5px", 
                border: errors.name ? "1px solid #dc3545" : "1px solid #ccc",
                boxSizing: "border-box"
              }}
              placeholder="Nombre del producto"
            />
            {errors.name && <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.name}</span>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              style={{ 
                width: "100%", 
                padding: "10px", 
                borderRadius: "5px", 
                border: "1px solid #ccc",
                boxSizing: "border-box",
                resize: "vertical"
              }}
              placeholder="Descripción del producto (opcional)"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Precio Unitario *
              </label>
              <input
                type="number"
                name="currentUnitPrice"
                value={formData.currentUnitPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  borderRadius: "5px", 
                  border: errors.currentUnitPrice ? "1px solid #dc3545" : "1px solid #ccc",
                  boxSizing: "border-box"
                }}
                placeholder="0.00"
              />
              {errors.currentUnitPrice && <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.currentUnitPrice}</span>}
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Stock *
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                min="0"
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  borderRadius: "5px", 
                  border: errors.stockQuantity ? "1px solid #dc3545" : "1px solid #ccc",
                  boxSizing: "border-box"
                }}
                placeholder="0"
              />
              {errors.stockQuantity && <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.stockQuantity}</span>}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button 
              type="button"
              onClick={() => navigate("/admin/products")}
              style={{ 
                padding: "12px 20px", 
                background: "#6c757d", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                cursor: "pointer" 
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              style={{ 
                padding: "12px 20px", 
                background: loading ? "#ccc" : "#007bff", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                cursor: loading ? "not-allowed" : "pointer" 
              }}
            >
              {loading ? "Actualizando..." : "Actualizar Producto"}
            </button>
          </div>
          </form>
        </div>
      </main>
    </div>
  );
}