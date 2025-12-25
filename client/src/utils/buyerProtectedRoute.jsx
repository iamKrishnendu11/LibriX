import { Navigate, Outlet } from "react-router-dom";

export default function BuyerProtectedRoute() {
  const token = localStorage.getItem("accessToken");
  const userType = localStorage.getItem("userType");

  // DEBUGGING: Remove these logs once fixed
  console.log("Token found:", !!token);
  console.log("UserType found:", userType);

  // If there is no token, or the user is NOT a buyer, kick them to login
  if (!token || userType !== "buyer") {
    return <Navigate to="/login" replace />;
  }

  // If everything matches, show the BuyerHome page
  return <Outlet />;
}