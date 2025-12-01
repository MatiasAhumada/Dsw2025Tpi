import React from "react";
import { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminLoginPage() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false); // Estado creado por error visual, al hacer click en el botón de login y si el usuario era incorrecto, no se leia el mensaje de error.
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
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔐 Login Administrador</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar como Admin"}
          </button>
        </form>

        {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}
      </div>
    </div>
  );
}