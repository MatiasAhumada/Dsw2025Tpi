import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminLoginPage() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        Nombre: usuario,
        Dni: contraseña
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", "Admin");
      navigate("/admin");

    } catch (error) {
      console.error('Error en login:', error);
      if (error.response?.status === 401) {
        setErrorMsg("Usuario o contraseña incorrectos");
      } else if (error.response?.status === 400) {
        setErrorMsg("Datos inválidos");
      } else {
        setErrorMsg("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/admin/register")}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Registrar Usuario
            </button>
          </div>
        </form>


      </div>
    </div>
  );
}