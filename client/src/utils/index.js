import BuyerNotifications from "@/buyer/pages/BuyerNotifications";
import SellerBids from "@/seller/pages/SellerBids";

const pageRoutes = {
  Landing: '/',
  Register:'/register',
  Login: '/login',
  SellerDashboard: '/seller/dashboard',
  SellerUploads:'/seller/uploads',
  LenderDashboard:'/lender/dashboard',
  SellerBids:'/seller/bids',
  SellerChat:'/seller/chat',
  SellerNotification:'/seller/notification',
  UserHome:'/buyer/home',
  BuyerNotifications:'/buyer/notifications'
};

// This function converts a page key to a usable URL
export function createPageUrl(pageName) {
  return pageRoutes[pageName] || '/';
}
