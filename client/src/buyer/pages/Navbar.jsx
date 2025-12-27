import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Settings,
  Home,
  Package,
} from "lucide-react";

import DynamicNavigation from "@/components/lightswind/dynamic-navigation";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  /* ================= Scroll Effect ================= */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= Click Outside Dropdown ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= Logout ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ================= NAV LINKS ================= */
  const links = [
    {
      id: "home",
      label: "Home",
      path: "/buyer/home",
      icon: <Home />,
    },
    {
      id: "orders",
      label: "My Orders",
      path: "/buyer/orders",
      icon: <Package />,
    },
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
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/buyer/home")}
            >
              <img
                src={Logo}
                alt="Logo"
                className="w-40 h-10 object-contain"
              />
            </div>

            {/* ================= CENTER : DESKTOP NAV ================= */}
            <div className="hidden md:flex items-center whitespace-nowrap">
              <DynamicNavigation
                links={links}
                theme="light"
                glowIntensity={4}
                onLinkClick={(id) => {
                  const link = links.find((l) => l.id === id);
                  if (link) navigate(link.path);
                }}
                className="flex-nowrap bg-gradient-to-br from-green-200 to-yellow-100 backdrop-blur-lg border"
              />
            </div>

            {/* ================= RIGHT : ICONS ================= */}
            <div className="flex items-center gap-4">

              {/* Notifications */}
              <button
                onClick={() => navigate("/buyer/notification")}
                className="relative p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className={`p-2 rounded-xl transition ${
                    isProfileOpen
                      ? "bg-slate-100"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <User className="w-5 h-5 text-slate-700" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-[60] animate-in fade-in zoom-in duration-200">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/settings");
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>

                    <hr className="my-1 border-slate-100" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
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
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100"
                >
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
