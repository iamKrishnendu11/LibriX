import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./common/landing.jsx";
import Register from "./common/register.jsx";
import Login from "./common/Login.jsx";

import SellerDashboard from "./seller/pages/Dashboard.jsx";
import SellerUploads from "./seller/pages/upload.jsx";
import SellerBids from "./seller/pages/SellerBids.jsx";
import SellerChat from "./seller/pages/SellerChat.jsx";
import SellerNotification from "./seller/pages/SellerNotification.jsx";

import LenderDashboard from "./lender/pages/Dashboard.jsx";
import LenderUpload from "./lender/pages/LenderUpload.jsx";
import LenderBooks from "./lender/pages/UploadedBooks.jsx"
import LenderNotification from "./lender/pages/LenderNotifications.jsx";

import UserHome from "./buyer/pages/UserHome.jsx";
import BuyerNotification from "./buyer/pages/BuyerNotifications.jsx";
import BookDetails from "./buyer/pages/BookDetails.jsx";
import LendBookDetails from "./buyer/pages/LendBookDetails.jsx";

import SellerProtectedRoute from "./utils/sellerProtectedRoute.jsx";
import BuyerProtectedRoute from "./utils/buyerProtectedRoute.jsx";
import LenderProtectedRoute from "./utils/lenderProtectedRoute.jsx";

import { SocketProvider } from "./utils/SocketProvider.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ---------- LENDER ROUTES (WITH SOCKET) ---------- */}
        <Route
          element={
            <LenderProtectedRoute>
              <SocketProvider role="lender" />
            </LenderProtectedRoute>
          }
        >
          <Route path="/lender/dashboard" element={<LenderDashboard />} />
          <Route path="/lender/upload" element={<LenderUpload />} />
          <Route path="/lender/books" element={<LenderBooks />} />
          <Route path="/lender/notification" element={<LenderNotification />} />
        </Route>

        {/* ---------- SELLER ROUTES (WITH SOCKET) ---------- */}
        <Route
          element={
            <SellerProtectedRoute>
              <SocketProvider role="seller" />
            </SellerProtectedRoute>
          }
        >
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/uploads" element={<SellerUploads />} />
          <Route path="/seller/bids" element={<SellerBids />} />
          <Route path="/seller/chat" element={<SellerChat />} />
          <Route
            path="/seller/notification"
            element={<SellerNotification />}
          />
        </Route>

        {/* ---------- BUYER ROUTES (WITH SOCKET) ---------- */}
        <Route
          element={
            <BuyerProtectedRoute>
              <SocketProvider role="buyer" />
            </BuyerProtectedRoute>
          }
        >
          <Route path="/buyer/home" element={<UserHome />} />
          <Route path="/buyer/book-details/:bookId" element={<BookDetails />} />
          <Route path="/buyer/lendBook-details/:bookId" element={<LendBookDetails />} />
          <Route
            path="/buyer/notification"
            element={<BuyerNotification />}
          />
        </Route>

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
