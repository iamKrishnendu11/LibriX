"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { Menu, X } from "lucide-react";

const HamburgerMenuOverlay = ({
  items = [],
  buttonTop = "60px",
  buttonLeft = "60px",
  buttonSize = "md",
  buttonColor = "#6c8cff",
  overlayBackground = "#6c8cff",
  textColor = "#ffffff",
  fontSize = "md",
  fontFamily = '"Krona One", monospace',
  fontWeight = "bold",
  animationDuration = 1.5,
  staggerDelay = 0.1,
  menuAlignment = "left",
  className,
  buttonClassName,
  menuItemClassName,
  keepOpenOnItemClick = false,
  customButton,
  ariaLabel = "Navigation menu",
  onOpen,
  onClose,
  menuDirection = "vertical",
  enableBlur = false,
  zIndex = 1000,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const containerRef = useRef(null);

  const buttonSizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const fontSizes = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl",
    "2xl": "text-6xl md:text-7xl",
  };

  const toggleMenu = () => {
    const next = !isOpen;
    setIsOpen(next);
    next ? onOpen?.() : onClose?.();
  };

  const handleItemClick = (item) => {
    if (item.onClick) item.onClick();
    if (item.href && !item.onClick) window.location.href = item.href;

    if (!keepOpenOnItemClick) {
      setIsOpen(false);
      onClose?.();
    }
  };

  /* Close on ESC */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className={cn("absolute w-full h-full", className)}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Krona+One&display=swap');

          .hamburger-overlay-${zIndex} {
            position: relative;
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: start;
            align-items: center;
            background: ${overlayBackground};
            z-index: ${zIndex};
            clip-path: circle(0px at ${buttonLeft} ${buttonTop});
            transition: clip-path ${animationDuration}s cubic-bezier(.25,.46,.45,.94);
            ${enableBlur ? "backdrop-filter: blur(10px);" : ""}
          }

          .hamburger-overlay-${zIndex}.open {
            clip-path: circle(150% at ${buttonLeft} ${buttonTop});
          }

          .hamburger-button-${zIndex} {
            position: absolute;
            left: ${buttonLeft};
            top: ${buttonTop};
            transform: translate(-50%, -50%);
            background: ${buttonColor};
            border-radius: 20px;
            z-index: ${zIndex + 1};
            border: none;
            cursor: pointer;
          }

          .menu-item-${zIndex} {
            list-style: none;
            padding: .5rem 0;
            cursor: pointer;
            transform: translateX(-200px);
            opacity: 0;
            transition: all .3s ease;
            font-family: ${fontFamily};
            font-weight: ${fontWeight};
            color: ${textColor};
          }

          .menu-item-${zIndex}.visible {
            transform: translateX(0);
            opacity: 1;
          }
        `}
      </style>

      {/* Overlay */}
      <div
        ref={navRef}
        className={cn(
          `flex flex-col items-center justify-center h-full hamburger-overlay-${zIndex}`,
          isOpen && "open"
        )}
        aria-hidden={!isOpen}
      >
        <ul className={cn("mt-20", menuDirection === "horizontal" && "flex gap-4")}>
          {items.map((item, index) => (
            <li
              key={index}
              className={cn(
                `menu-item-${zIndex}`,
                fontSizes[fontSize],
                isOpen && "visible",
                menuItemClassName
              )}
              style={{ transitionDelay: `${index * staggerDelay}s` }}
              tabIndex={isOpen ? 0 : -1}
              role="button"
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleItemClick(item);
                }
              }}
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button */}
      <button
        className={cn(
          `hamburger-button-${zIndex}`,
          buttonSizes[buttonSize],
          buttonClassName
        )}
        onClick={toggleMenu}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        {customButton || (
          <div className="relative w-full h-full flex items-center justify-center">
            <Menu
              className={cn(
                "absolute transition-all",
                isOpen ? "opacity-0 scale-0" : "opacity-100"
              )}
              size={20}
              color={textColor}
            />
            <X
              className={cn(
                "absolute transition-all",
                isOpen ? "opacity-100" : "opacity-0 scale-0"
              )}
              size={20}
              color={textColor}
            />
          </div>
        )}
      </button>
    </div>
  );
};

export default HamburgerMenuOverlay;