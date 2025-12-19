import Register from "@/common/register";

const pageRoutes = {
  Landing: '/',
  Register:'/register',
  Login: '/login',
  SellerDashboard: '/seller/dashboard',
  
};

// This function converts a page key to a usable URL
export function createPageUrl(pageName) {
  return pageRoutes[pageName] || '/';
}
