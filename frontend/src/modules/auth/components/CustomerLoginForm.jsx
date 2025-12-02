import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerLoginForm() {
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

      setIsLogin(true);

    } catch (err) {
      console.error(err);
      setErrorMsg("Error al conectar con el servidor");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border-l-4 border-blue-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido!</h2>
        <p className="text-gray-600">Para continuar con tu compra, necesitas iniciar sesión o registrarte</p>
      </div>

      <div className="mb-8">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition duration-200 ${
              isLogin 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition duration-200 ${
              !isLogin 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>
      </div>

      <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
        {isLogin ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition duration-200"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition duration-200"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition duration-200"
                placeholder="Elige tu nombre de usuario"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition duration-200"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition duration-200"
                placeholder="Crea una contraseña segura"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar contraseña</label>
              <input
                type="password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition duration-200"
                placeholder="Repite tu contraseña"
                required
              />
            </div>
          </>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠</span>
              {errorMsg}
            </div>
          </div>
        )}

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
          >
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </button>
        </div>
      </form>

      <div className="text-center mt-8">
        <a 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-200"
        >
          <span className="mr-2">←</span>
          Volver a la tienda
        </a>
      </div>
    </div>
  );
}