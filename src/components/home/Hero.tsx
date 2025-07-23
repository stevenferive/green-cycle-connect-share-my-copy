
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Leaf } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-10 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Reutilizar es{" "}
                <span className="text-green animate-pulse-light">Reconstruir el</span>{" "}
                <span className="text-water">Planeta</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Compra, vende e intercambia productos usados para un futuro sostenible.
              </p>
            </div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link to="/login">
                <Button className="bg-orange hover:bg-orange-dark text-white" size="lg">
                  <Search className="mr-2 h-5 w-5" /> Explorar Productos
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-orange text-orange hover:bg-orange hover:text-white">
                  Vender Producto
                </Button>
              </Link>
            </div>
          </div>

          {!isMobile && (
            <div className="flex items-center justify-center">
              <div className="relative max-w-full">
                <div className="absolute -top-6 -left-6 h-64 w-64 rounded-full bg-green/10 animate-pulse-light"></div>
                <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-full bg-water/10 animate-pulse-light"></div>
                <div className="absolute -top-6 -right-10 h-[450px] w-[450px] rounded-full bg-green/10 "></div>
                <img
                  src="/primero.png"
                  alt="Ilustración de sostenibilidad con bicicleta y elementos reutilizables"
                  className="rounded-2xl object-cover h-[500px] w-full max-w-[500px] z-10 relative"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sección de estadísticas */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="font-heading text-3xl font-bold text-green">98.5%</div>
            <p className="text-sm text-muted-foreground mt-2">CO2 reducido</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="font-heading text-3xl font-bold text-green">+15,000</div>
            <p className="text-sm text-muted-foreground mt-2">Usuarios activos</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="font-heading text-3xl font-bold text-green flex items-center justify-center">
              30,000 <Leaf className="ml-2 h-6 w-6 text-green" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Productos intercambiados</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
