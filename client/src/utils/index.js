



const pageRoutes = {
  Landing: '/',
  Register:'/register',
  Login: '/login',
  SellerDashboard: '/seller/dashboard',
  SellerUploads:'/seller/uploads',
  LenderDashboard:'/lender/dashboard',
  LenderUpload:'/lender/upload',
  SellerBids:'/seller/bids',
  SellerChat:'/seller/chat',
  SellerNotification:'/seller/notification',
  UserHome:'/buyer/home',
  BuyerNotification:'/buyer/notification',
  LenderBooks:'/lender/books',
  BookDetails:'/buyer/book-details/:bookId',
  LendBookDetails:'/buyer/lendBook-details/:bookId',
  LenderNotifications:'/lender/notification',
};

// This function converts a page key to a usable URL
export function createPageUrl(pageName) {
  return pageRoutes[pageName] || '/';
}

// -------- PROTECTED ROUTES --------
export { default as SellerProtectedRoute } from "./sellerProtectedRoute.jsx";
export { default as BuyerProtectedRoute } from "./buyerProtectedRoute.jsx";

// -------- SOCKET PROVIDER (🔥 REQUIRED FIX) --------
export { SocketProvider } from "./SocketProvider.jsx";
