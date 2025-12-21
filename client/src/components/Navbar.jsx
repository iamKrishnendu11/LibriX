import MorphingNavigation from "../components/lightswind/morphing-navigation";
import HamburgerMenuOverlay from "../components/lightswind/hamburger-menu-overlay";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  Home,
  ShoppingBag,
  Info,
  HelpCircle,
  LogIn,
  ArrowRight,
} from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [onHero, setOnHero] = useState(true);

  // HERO SECTION OBSERVER
  useEffect(() => {
  const handleScroll = () => {
    // Change navbar after 120px scroll
    setOnHero(window.scrollY < 120);
  };

  handleScroll(); // run on load
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);



  const links = [
    { id: "home", label: "Home", href: "#home", icon: <Home size={16} /> },
    { id: "shop", label: "Shop", href: "#shop", icon: <ShoppingBag size={16} /> },
    { id: "about", label: "About", href: "#about", icon: <Info size={16} /> },
    { id: "help", label: "Help", href: "#help", icon: <HelpCircle size={16} /> },
  ];

  const mobileMenuItems = [
    { label: "Home", icon: <Home size={20} />, href: "#home" },
    { label: "Shop", icon: <ShoppingBag size={20} />, href: "#shop" },
    { label: "About", icon: <Info size={20} />, href: "#about" },
    { label: "Help", icon: <HelpCircle size={20} />, href: "#help" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">

        {/* LEFT — MOBILE ONLY */}
        <div className="flex items-center gap-4 h-10">
          <div className="md:hidden flex items-center h-10 -ml-6">
            <HamburgerMenuOverlay
              items={mobileMenuItems}
              isOpen={menuOpen}
              onOpen={() => setMenuOpen(true)}
              onClose={() => setMenuOpen(false)}
              overlayBackground="#facc15"
              fontSize="xl"
              enableBlur={false}
              menuAlignment="center"
              animationDuration={1.2}
              iconColor="#ffffff"
            />
          </div>

          {/* LOGO — DESKTOP ONLY */}
          <img
            src={logo}
            alt="Logo"
            className={`hidden md:block ml-10 h-18 w-auto select-none self-center transition-all duration-300
              ${
                onHero
                  ? "brightness-0 invert"
                  : "brightness-100 invert-0"
              }
            `}
          />
        </div>

        {/* CENTER — DESKTOP NAV */}
        <div
          className={`hidden md:flex justify-center transition-all duration-300
            ${onHero ? "flex-[0.6]" : "flex-1"}
          `}
        >
          <MorphingNavigation
            links={links}
            theme="custom"
            backgroundColor="transparent"
            borderColor="transparent"
            textColor={onHero ? "#ffffff" : "#000000"}
            animationDuration={1.1}
            enablePageBlur={false}
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 h-10">

          {/* LOGIN */}
          <Link
            to="/login"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all duration-300
              ${
                onHero
                  ? "md:text-white"
                  : "border border-black bg-gradient-to-r from-yellow-100 to-green-300 text-black"
              }
            `}
          >
            <LogIn size={16} />
            Login
          </Link>

          {/* GET STARTED */}
          <Link
            to="/register"
            className={`hidden md:flex items-center gap-2 rounded-xl px-5 py-2 text-sm transition-all duration-300
              ${
                onHero
                  ? "text-white"
                  : "border border-black bg-gradient-to-r from-yellow-400 to-green-600 text-black"
              }
            `}
          >
            Get Started
            <ArrowRight size={16} />
          </Link>

        </div>
      </div>
    </nav>
  );
}




// import { useState } from "react";
// import { MorphingNavigation } from "../components/lightswind/morphing-navigation";
// import { HamburgerMenuOverlay } from "../components/lightswind/hamburger-menu-overlay";
// import { Home, ShoppingBag, Info, HelpCircle, LogIn, ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const links = [
//     { id: "home", label: "Home", href: "#home", icon: <Home size={16} /> },
//     { id: "shop", label: "Shop", href: "#shop", icon: <ShoppingBag size={16} /> },
//     { id: "about", label: "About", href: "#about", icon: <Info size={16} /> },
//     { id: "help", label: "Help", href: "#help", icon: <HelpCircle size={16} /> },
//   ];

//   const mobileMenuItems = links.map(link => ({
//     label: link.label,
//     icon: link.icon,
//     href: link.href
//   }));

//   return (
//     <nav className="fixed top-0 z-50 w-full bg-transparent backdrop-blur-md">
//       <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
//         {/* LEFT — MOBILE HAMBURGER + LOGO */}
//         <div className="flex items-center gap-4 h-10">
//           <div className="md:hidden flex items-center h-10 -ml-6">
//             <HamburgerMenuOverlay
//               items={mobileMenuItems}
//               isOpen={menuOpen}
//               onOpen={() => setMenuOpen(true)}
//               onClose={() => setMenuOpen(false)}
//               overlayBackground="#facc15"
//               fontSize="xl"
//               enableBlur={false}
//               menuAlignment="center"
//               animationDuration={1.2}
//               iconColor="#ffffff"
//             />
//           </div>
//           <img src={logo} alt="Logo" className="ml-10 h-18 w-auto select-none self-center" />
//         </div>

//         {/* CENTER — DESKTOP */}
//         <div className="hidden md:flex flex-1 justify-center">
//           <MorphingNavigation
//             links={links}
//             theme="custom"
//             backgroundColor="transparent"
//             borderColor="transparent"
//             textColor="#000000"
//             animationDuration={1.1}
//             enablePageBlur={false}
//           />
//         </div>

//         {/* RIGHT — LOGIN / CTA */}
//         <div className="flex items-center gap-4 h-10">
//           <button
//             onClick={() => navigate("/register")}
//             className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm text-black self-center bg-white/90 hover:bg-white"
//           >
//             <LogIn size={16} />
//             Login
//           </button>

//           <button className="hidden md:flex items-center gap-2 rounded-xl bg-black px-5 py-2 text-sm text-white">
//             Get Started
//             <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }
