import React from "react";
import { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

export default function CustomerLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // Aquí necesitaremos crear el endpoint de login para customer
      const res = await fetch("http://localhost:5142/api/auth/login/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Dni: dni }),
      });

      if (!res.ok) {
        setErrorMsg("Email o contraseña incorrectos");
        return;
      }

      const data = await res.json();

      // Guardar token y datos
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", "Customer");
      localStorage.setItem("userData", JSON.stringify({ email, name: nombre }));

      // Redirigir al checkout
      navigate("/checkout");

    } catch (err) {
      console.error(err);
      setErrorMsg("Error al conectar con el servidor");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5142/api/register/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          Email: email, 
          Name: nombre, 
          PhoneNumber: "", 
          Dni: dni 
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setErrorMsg(error.error || "Error al registrarse");
        return;
      }

      // Registro exitoso, ahora hacer login automático
      handleLogin(e);

    } catch (err) {
      console.error(err);
      setErrorMsg("Error al conectar con el servidor");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🛒 Finalizar Compra</h2>
        <p>Para continuar con tu compra, necesitas iniciar sesión o registrarte</p>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button 
            className={isLogin ? "btn-primary" : "btn-secondary"}
            onClick={() => setIsLogin(true)}
            style={{ flex: 1 }}
          >
            Iniciar Sesión
          </button>
          <button 
            className={!isLogin ? "btn-primary" : "btn-secondary"}
            onClick={() => setIsLogin(false)}
            style={{ flex: 1 }}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Contraseña (DNI)"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary">
            {isLogin ? "Iniciar Sesión y Comprar" : "Registrarse y Comprar"}
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