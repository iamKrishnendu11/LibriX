import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./common/landing.jsx";
import Register from "./common/register.jsx";
import Login from "./common/Login.jsx";

import SellerDashboard from "./seller/pages/Dashboard.jsx";
import SellerUploads from "./seller/pages/upload.jsx"
import LenderDashboard from "./lender/pages/Dashboard.jsx";
import SellerBids from "./seller/pages/SellerBids.jsx";
import SellerChat from "./seller/pages/SellerChat.jsx";
import SellerNotifications from "./seller/pages/SellerNotification.jsx";
import UserHome from "./buyer/pages/UserHome.jsx";
import SellerProtectedRoute from "./utils/sellerProtectedRoute.jsx";
import BookDetail from "./buyer/pages/BookDetails.jsx";
import LenderUpload from "./lender/pages/LenderUpload.jsx";
import LenderNotifications from "./lender/pages/LenderNotifications.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lender/dashboard" element={<LenderDashboard />} />
        <Route path="/buyer/home" element={<UserHome />} />
        <Route path="/buyer/bookdetail" element={<BookDetail />} />
        <Route path="/lender/upload" element={<LenderUpload />} />
        <Route path="/lender/notification" element={<LenderNotifications />} />

        {/* -------- SELLER PROTECTED ROUTES -------- */}
        <Route element={<SellerProtectedRoute />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/uploads" element={<SellerUploads />} />
          <Route path="/seller/bids" element={<SellerBids />} />
          <Route path="/seller/chat" element={<SellerChat />} />
          <Route path="/seller/notification" element={<SellerNotifications />} />
        </Route>

        {/* -------- FALLBACK -------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

