import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicProductsPage from "./pages/PublicProductsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";

import DashboardPage from "./pages/DashboardPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";
import CartPage from "./pages/CartPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicProductsPage />} />
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />

        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/products/create" element={<CreateProductPage />} />
        <Route path="/admin/products/edit/:id" element={<EditProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/customer-login" element={<CustomerLoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;