import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    
    if (token && userType === "Admin") {
      setIsAuthenticated(true);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ name: payload.unique_name || "Admin", type: userType });
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userType, userData = null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userType", userType);
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
    
    setIsAuthenticated(true);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ name: payload.unique_name || userType, type: userType });
    } catch (error) {
      setUser({ name: userType, type: userType });
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}