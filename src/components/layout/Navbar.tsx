
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, Search, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Recycle className="h-6 w-6 text-green animate-float" />
            <span className="font-heading text-xl font-bold text-green">
              GreenCycle
            </span>
          </Link>
        </div>

        {!isMobile ? (
          <>
            <div className="hidden md:flex md:gap-6">
              <Link to="/explore" className="text-foreground/80 hover:text-foreground">
                Explorar
              </Link>
              <Link to="/categories" className="text-foreground/80 hover:text-foreground">
                Categorías
              </Link>
              <Link to="/about" className="text-foreground/80 hover:text-foreground">
                Nosotros
              </Link>
              <Link to="/education" className="text-foreground/80 hover:text-foreground">
                Ecotips
              </Link>
            </div>

            <div className="hidden md:flex md:items-center md:gap-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Link to="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-green hover:bg-green-dark">Registrarse</Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="container border-t py-3">
          <div className="flex flex-col space-y-3">
            <Link to="/explore" className="py-2 text-foreground/80 hover:text-foreground">
              Explorar
            </Link>
            <Link to="/categories" className="py-2 text-foreground/80 hover:text-foreground">
              Categorías
            </Link>
            <Link to="/about" className="py-2 text-foreground/80 hover:text-foreground">
              Nosotros
            </Link>
            <Link to="/education" className="py-2 text-foreground/80 hover:text-foreground">
              Ecotips
            </Link>
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full">Iniciar Sesión</Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button className="w-full bg-green hover:bg-green-dark">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
