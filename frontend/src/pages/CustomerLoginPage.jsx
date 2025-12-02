import React from "react";
import { useState } from "react";
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Finalizar Compra</h2>
        <p className="text-gray-600 text-center mb-6">Para continuar con tu compra, necesitas iniciar sesión o registrarte</p>

        <div className="flex gap-2 mb-6">
          <button 
            className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-200 ${
              isLogin 
                ? 'bg-purple-300 text-gray-700' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-200 ${
              !isLogin 
                ? 'bg-purple-300 text-gray-700' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          {isLogin ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errorMsg && <p className="text-red-500 text-sm mt-1">Error</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errorMsg && <p className="text-red-500 text-sm mt-1">Error</p>}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errorMsg && <p className="text-red-500 text-sm mt-1">Error</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errorMsg && <p className="text-red-500 text-sm mt-1">Error</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Seleccione una opción</option>
                </select>
                {errorMsg && <p className="text-red-500 text-sm mt-1">Error</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errorMsg && <p className="text-red-500 text-sm mt-1">Error</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmarContrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errorMsg && <p className="text-red-500 text-sm mt-1">Error</p>}
              </div>
            </>
          )}

          <div className="space-y-3 pt-4">
            <button
              type="submit"
              className="w-full bg-purple-300 hover:bg-purple-400 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
            >
              {isLogin ? "Iniciar Sesión" : "Registrar Usuario"}
            </button>
            
            {isLogin && (
              <button
                type="button"
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Registrar Usuario
              </button>
            )}
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMsg}
          </div>
        )}

        <p className="text-center mt-6">
          <a href="/" className="text-blue-600 hover:text-blue-800">← Volver a la tienda</a>
        </p>
      </div>
    </div>
  );
}