import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../shared/services/api";

export default function AdminRegisterForm() {
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
    { value: "Customer", label: "Cliente" }
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
      if (formData.role === "Customer") {
        await api.post('/customers/register', {
          Name: formData.usuario,
          Email: formData.email,
          Dni: formData.contraseña,
          PhoneNumber: ""
        });
      } else {
        await api.post('/auth/register', {
          Nombre: formData.usuario,
          Email: formData.email,
          Dni: formData.contraseña,
          Role: formData.role
        });
      }

      navigate("/admin");

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
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border-l-4 border-green-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Registrar Usuario</h2>
        <p className="text-gray-600">Crear nuevo administrador o cliente</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 transition duration-200"
            placeholder="Ingresa el nombre de usuario"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 transition duration-200"
            placeholder="usuario@ejemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rol</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 transition duration-200"
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 transition duration-200"
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Contraseña</label>
          <input
            type="password"
            name="confirmarContraseña"
            value={formData.confirmarContraseña}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 transition duration-200"
            placeholder="Repite la contraseña"
            required
          />
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠</span>
              {errorMsg}
            </div>
          </div>
        )}

        <div className="space-y-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
          >
            {loading ? "Registrando..." : "Registrar Usuario"}
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
          >
            Volver al Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}