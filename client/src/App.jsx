import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./common/landing.jsx";
import Register from "./common/register.jsx";
import Login from "./common/Login.jsx";

import SellerDashboard from "./seller/pages/Dashboard.jsx";
import SellerUploads from "./seller/pages/upload.jsx";

import SellerProtectedRoute from "./utils/sellerProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* -------- SELLER PROTECTED ROUTES -------- */}
        <Route element={<SellerProtectedRoute />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/uploads" element={<SellerUploads />} />
        </Route>

        {/* -------- FALLBACK -------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

