import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicProductsPage from "./modules/client/pages/PublicProductsPage";
import AdminLoginPage from "./modules/auth/pages/AdminLoginPage";
import AdminRegisterPage from "./modules/auth/pages/AdminRegisterPage";

import DashboardPage from "./modules/admin/pages/DashboardPage";
import ProductsPage from "./modules/products/pages/ProductsPage";
import CreateProductPage from "./modules/products/pages/CreateProductPage";
import EditProductPage from "./modules/products/pages/EditProductPage";

import CustomerLoginPage from "./modules/auth/pages/CustomerLoginPage";
import CheckoutPage from "./modules/cart/pages/CheckoutPage";
import OrdersPage from "./modules/orders/pages/OrdersPage";

import { AuthProvider } from "./modules/auth/context/AuthProvider";
import { ProtectedRoute } from "./modules/auth/components/ProtectedRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <PublicProductsPage />,
  },
  {
    path: "/customer-login",
    element: <CustomerLoginPage />,
  },
  {
    path: "/cart",
    element: <CheckoutPage />,
  },
  {
    path: "/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/products",
    element: (
      <ProtectedRoute>
        <ProductsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/products/create",
    element: (
      <ProtectedRoute>
        <CreateProductPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/products/edit/:id",
    element: (
      <ProtectedRoute>
        <EditProductPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedRoute>
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/signup",
    element: (
      <ProtectedRoute>
        <AdminRegisterPage />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}

export default App;