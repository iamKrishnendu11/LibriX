import React, { useState, useEffect } from "react";
import { Menu, X, Bell, User } from "lucide-react";
import  DynamicNavigation  from "@/components/lightswind/dynamic-navigation";
import { Home, Gavel, Package, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo.png"; // 👈 adjust path if needed

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* 🔥 Seller Navigation Links */
  const links = [
    { id: "home", label: "Home", href: "/seller/dashboard", icon: <Home /> },
    { id: "bidding", label: "Reverse Bidding", href: "/seller/bidding", icon: <Gavel /> },
    { id: "orders", label: "My Orders", href: "/seller/orders", icon: <Package /> },
    { id: "books", label: "Books", href: "/seller/books", icon: <BookOpen /> },
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
            <div className="flex items-center gap-3">
              <img
                src={Logo}
                alt="Logo"
                className="w-40 h-10 object-contain"
              />
              
            </div>

            {/* ================= CENTER : DYNAMIC NAV ================= */}
            <div className="hidden md:flex items-center whitespace-nowrap">
            <DynamicNavigation
                links={links}
                theme="light"
                glowIntensity={4}
                onLinkClick={(id) => console.log("Clicked:", id)}
                className="flex-nowrap bg-gradient-to-br from-green-200 to-yellow-100 backdrop-blur-lg
                  border"
            />
            </div>

            {/* ================= RIGHT : ICONS ================= */}
            <div className="flex items-center gap-4">
              {/* Notification */}
              <button className="relative p-2 rounded-xl hover:bg-slate-100 transition">
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User */}
              <button className="p-2 rounded-xl hover:bg-slate-100 transition">
                <User className="w-5 h-5 text-slate-700" />
              </button>

              {/* Mobile menu */}
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
                <a
                  key={item.id}
                  href={item.href}
                  className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
