import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    role: "Admin",
    contraseña: "",
    confirmarContraseña: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { value: "Admin", label: "Administrador" },
    { value: "Manager", label: "Gerente" },
    { value: "Supervisor", label: "Supervisor" }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.contraseña !== formData.confirmarContraseña) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    if (formData.contraseña.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        Nombre: formData.usuario,
        Email: formData.email,
        Dni: formData.contraseña,
        Role: formData.role
      });

      alert("Usuario registrado exitosamente");
      navigate("/login");

    } catch (error) {
      console.error('Error en registro:', error);
      if (error.response?.status === 400) {
        setErrorMsg("El usuario o email ya existe");
      } else {
        setErrorMsg("Error al registrar usuario");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Registrar Admin</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMsg}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-300 hover:bg-purple-400 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Volver al Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}