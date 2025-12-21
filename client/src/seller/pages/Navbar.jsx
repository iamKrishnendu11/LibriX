import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import DynamicNavigation from "@/components/lightswind/dynamic-navigation";
import { Home, Gavel, Package, BookOpen } from "lucide-react";
import Logo from "@/assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // 1. Clear credentials so SellerProtectedRoute blocks access
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("user");
    
    // 2. Redirect to login
    navigate("/login");
  };

  const links = [
    { id: "home", label: "Home", href: "/seller/dashboard", icon: <Home /> },
    { id: "bidding", label: "Reverse Bidding", href: "/seller/bidding", icon: <Gavel /> },
    { id: "orders", label: "My Orders", href: "/seller/orders", icon: <Package /> },
    { id: "books", label: "Books", href: "/seller/uploads", icon: <BookOpen /> },
  ];

  const handleNavigation = (href) => {
    navigate(href);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-3" : "py-5"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-2xl transition-all duration-500 ${isScrolled ? "bg-white/80 backdrop-blur-xl shadow-lg" : "bg-white/60 backdrop-blur-md"}`}>
          <div className="flex items-center justify-between px-6 py-4">
            
            {/* LOGO */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src={Logo} alt="Logo" className="w-40 h-10 object-contain" />
            </div>

            {/* CENTER NAV */}
            <div className="hidden md:flex items-center whitespace-nowrap">
              <DynamicNavigation
                links={links}
                theme="light"
                glowIntensity={4}
                onLinkClick={(id) => {
                  const clickedLink = links.find(link => link.id === id);
                  if (clickedLink) handleNavigation(clickedLink.href);
                }}
                className="flex-nowrap bg-gradient-to-br from-green-200 to-yellow-100 backdrop-blur-lg border"
              />
            </div>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl hover:bg-slate-100 transition">
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* USER DROPDOWN MENU */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 p-2 rounded-xl transition ${isUserMenuOpen ? 'bg-slate-100 shadow-inner' : 'hover:bg-slate-100'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-green-500 flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* DROPDOWN POPUP */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-sm font-semibold text-slate-900">Seller Account</p>
                      <p className="text-xs text-slate-500 truncate">Manage your store</p>
                    </div>
                    
                    <button 
                      onClick={() => handleNavigation("/seller/dashboard")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-green-600" />
                      Dashboard
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-xl hover:bg-slate-100">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t px-4 py-3 space-y-1 bg-white/90 rounded-b-2xl">
              {links.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              <button 
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}