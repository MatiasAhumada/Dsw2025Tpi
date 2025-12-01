import React from "react";
import { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

export default function CustomerLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5142/api/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: usuario, Dni: contrasena }),
      });

      if (!res.ok) {
        const error = await res.json();
        setErrorMsg(error.error || "Error al iniciar sesión");
        return;
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", "Customer");
      localStorage.setItem("userData", JSON.stringify(data.customer));
      navigate("/");

    } catch (err) {
      console.error(err);
      setErrorMsg("Error al conectar con el servidor");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (contrasena !== confirmarContrasena) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:5142/api/customers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          Email: email,
          Name: usuario, 
          PhoneNumber: telefono,
          Dni: contrasena 
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setErrorMsg(error.error || "Error al registrarse");
        return;
      }

      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setIsLogin(true);

    } catch (err) {
      console.error(err);
      setErrorMsg("Error al conectar con el servidor");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Finalizar Compra</h2>
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
          {isLogin ? (
            <>
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
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </>
          ) : (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </>
          )}

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