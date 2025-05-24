import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, Search, Menu, User, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

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
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green text-white">
                          {getInitials(user?.firstName, user?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Iniciar Sesión</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-green hover:bg-green-dark">Registrarse</Button>
                  </Link>
                </>
              )}
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
            
            {isAuthenticated ? (
              <div className="flex flex-col pt-2">
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green text-white">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Link to="/profile" className="py-2 text-foreground/80 hover:text-foreground">
                  Mi perfil
                </Link>
                <Button 
                  variant="outline" 
                  className="mt-2 w-full justify-start" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full">Iniciar Sesión</Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button className="w-full bg-green hover:bg-green-dark">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
