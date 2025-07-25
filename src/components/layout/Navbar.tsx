import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo-green-cicle.svg"
              alt="GreenCycle Logo"
              className="h-14 w-14"
            />
            <span className="font-heading text-xl font-bold text-[#32834B]">
              GreenCycle
            </span>
          </Link>
        </div>

        {!isMobile ? (
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link to="/categories" className="text-[#32834B] hover:text-gray-600 font-bold transition-colors">
              Categorías
            </Link>
            <Link to="/about" className="text-[#32834B] hover:text-gray-600 font-bold transition-colors">
              Nosotros
            </Link>
            <Link to="/login">
              <Button variant="outline" className="ml-4 font-bold">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-800 hover:text-gray-600 transition-colors"
              aria-label="Abrir menú"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Menú móvil desplegable */}
      {isMobile && isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            <Link 
              to="/categories" 
              className="block text-[#32834B] hover:text-gray-600 font-bold transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categorías
            </Link>
            <Link 
              to="/about" 
              className="block text-[#32834B] hover:text-gray-600 font-bold transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full font-bold">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
