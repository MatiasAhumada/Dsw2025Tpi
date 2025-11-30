import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicProductsPage from "./pages/PublicProductsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicProductsPage />} />
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/customer-login" element={<CustomerLoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;