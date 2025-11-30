import React from "react";
import { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5142/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nombre: usuario, Dni: contraseña }),
      });

      if (!res.ok) {
        setErrorMsg("Usuario o contraseña incorrectos");
        return;
      }

      const data = await res.json();

      // Guardar token
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", "Admin");

      // Redirigir al dashboard admin
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setErrorMsg("Error al conectar con el servidor");
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
            placeholder="Contraseña (DNI)"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary">
            Ingresar como Admin
          </button>
        </form>

        {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}

        <p className="auth-link">
          <a href="/">← Volver a la tienda</a>
        </p>
      </div>
    </div>
  );
}