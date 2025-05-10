
import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <section className="bg-gradient-to-b from-green-light/10 to-transparent py-10 md:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Reutilizar es{" "}
                <span className="text-green animate-pulse-light">Reconstruir</span> el{" "}
                <span className="text-water">Planeta</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Compra, vende e intercambia productos de segunda mano y contribuye a 
                un futuro más sostenible para todos.
              </p>
            </div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button className="bg-green hover:bg-green-dark text-white" size="lg">
                <Search className="mr-2 h-5 w-5" /> Explorar Productos
              </Button>
              <Button variant="outline" size="lg">
                Vender Producto
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="font-heading text-2xl font-bold text-green">98.5%</div>
                <p className="text-sm text-muted-foreground">Reducción de CO2</p>
              </div>
              <div className="text-center">
                <div className="font-heading text-2xl font-bold text-green">+15,000</div>
                <p className="text-sm text-muted-foreground">Usuarios Activos</p>
              </div>
              <div className="text-center">
                <div className="font-heading text-2xl font-bold text-green">+30,000</div>
                <p className="text-sm text-muted-foreground">Productos Intercambiados</p>
              </div>
            </div>
          </div>

          {!isMobile && (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 h-64 w-64 rounded-full bg-green/10 animate-pulse-light"></div>
                <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-full bg-water/10 animate-pulse-light"></div>
                <img
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80"
                  alt="Economía circular"
                  className="rounded-2xl object-cover shadow-lg h-[460px] w-[460px] z-10 relative animate-float"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
