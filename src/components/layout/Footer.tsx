
import React from "react";
import { Link } from "react-router-dom";
import { Recycle, Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-secondary">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Recycle className="h-6 w-6 text-green" />
              <span className="font-heading text-xl font-bold text-green">GreenCycle</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Plataforma dedicada a la reutilización y el intercambio de productos
              de segunda mano con un fuerte compromiso ecológico.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-green">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-green">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-green">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-green">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-3 font-heading font-semibold">Explorar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-foreground">
                  Categorías
                </Link>
              </li>
              <li>
                <Link to="/local" className="text-muted-foreground hover:text-foreground">
                  Cerca de ti
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-muted-foreground hover:text-foreground">
                  Tendencias
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 font-heading font-semibold">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/education" className="text-muted-foreground hover:text-foreground">
                  Ecotips
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/calculate-impact" className="text-muted-foreground hover:text-foreground">
                  Calculadora Ecológica
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 font-heading font-semibold">Compañía</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GreenCycle. Todos los derechos reservados.</p>
          <p className="mt-1">
            Promoviendo la economía circular y un futuro más sostenible.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
