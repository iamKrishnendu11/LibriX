import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { Menu, X, Bell, User, LogOut, Settings } from "lucide-react";
import DynamicNavigation from "@/components/lightswind/dynamic-navigation";
import { Home, Gavel, Package, BookOpen } from "lucide-react";
import Logo from "@/assets/logo.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // 1. Clear session/local storage
    localStorage.clear(); 
    sessionStorage.clear();
    
    // 2. Close the dropdown
    setIsUserMenuOpen(false);
    
    // 3. Redirect to login or home
    navigate("/login"); 
  };

  const navigateTo = (path) => {
    setIsUserMenuOpen(false);
    navigate(path);
  };

  /* 🔥 Lender Navigation Links */
  const links = [
    { id: "home", label: "Dashboard", href: "/lender/dashboard", icon: <Home /> },
    { id: "bidding", label: "My Upload", href: "/lender/books", icon: <Gavel /> },
    { id: "orders", label: "My Orders", href: "/seller/orders", icon: <Package /> },
    { id: "books", label: "Upload books", href: "/lender/upload", icon: <BookOpen /> }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative rounded-2xl transition-all duration-500 ${
            isScrolled
              ? "bg-white/80 backdrop-blur-xl shadow-lg"
              : "bg-white/60 backdrop-blur-md"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* ================= LEFT : LOGO ================= */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src={Logo} alt="Logo" className="w-40 h-10 object-contain" />
            </div>

            {/* ================= CENTER : DYNAMIC NAV ================= */}
            <div className="hidden md:flex items-center whitespace-nowrap">
              <DynamicNavigation
                links={links}
                theme="light"
                glowIntensity={4}
                onLinkClick={(id) => {
                    const link = links.find(l => l.id === id);
                    if(link) navigate(link.href);
                }}
                className="flex-nowrap bg-gradient-to-br from-green-200 to-yellow-100 backdrop-blur-lg border"
              />
            </div>

            {/* ================= RIGHT : ICONS ================= */}
            <div className="flex items-center gap-4">
              <button onClick={() => navigateTo("/lender/notification")}
               className="relative p-2 rounded-xl hover:bg-slate-100 transition">
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Dropdown Container */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`p-2 rounded-xl transition ${
                    isUserMenuOpen ? "bg-slate-100 shadow-inner" : "hover:bg-slate-100"
                  }`}
                >
                  <User className="w-5 h-5 text-slate-700" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[-1]" 
                      onClick={() => setIsUserMenuOpen(false)}
                    ></div>
                    
                    <div className="absolute right-0 mt-3 w-48 origin-top-right rounded-2xl border border-slate-200/50 bg-white/90 backdrop-blur-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200">
                      <button
                        onClick={() => navigateTo("/seller/profile")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 transition"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => navigateTo("/seller/settings")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* ================= MOBILE MENU ================= */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t px-4 py-3 space-y-2">
              {links.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(item.href);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  {React.cloneElement(item.icon, { size: 18 })}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}