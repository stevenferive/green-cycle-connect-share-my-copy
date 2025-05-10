
import React from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Droplet, Wind } from "lucide-react";

const EcoImpact = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-green-light/10 to-water-light/5">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading text-2xl font-bold md:text-3xl mb-4">
            Tu Impacto Ecológico <span className="text-green">Importa</span>
          </h2>
          <p className="text-muted-foreground">
            Cada vez que reutilizas o intercambias un producto, estás contribuyendo a 
            reducir la huella de carbono y proteger nuestro planeta. Visualiza el impacto
            que estás generando con cada transacción.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="eco-card flex flex-col items-center p-6 text-center">
            <div className="rounded-full bg-green/10 p-4 mb-4">
              <Leaf className="h-8 w-8 text-green" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">Reducción de CO2</h3>
            <p className="text-muted-foreground mb-4">
              Al reutilizar productos, reduces la necesidad de producir nuevos, 
              lo que disminuye las emisiones de CO2.
            </p>
            <div className="font-heading text-3xl font-bold text-green mt-auto">
              +15,400 kg
            </div>
            <p className="text-sm text-muted-foreground">de CO2 evitado este mes</p>
          </div>

          <div className="eco-card flex flex-col items-center p-6 text-center">
            <div className="rounded-full bg-water/10 p-4 mb-4">
              <Droplet className="h-8 w-8 text-water" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">Agua Ahorrada</h3>
            <p className="text-muted-foreground mb-4">
              La producción de nuevos artículos consume grandes cantidades de agua. 
              Tu reutilización marca la diferencia.
            </p>
            <div className="font-heading text-3xl font-bold text-water mt-auto">
              +890,000 L
            </div>
            <p className="text-sm text-muted-foreground">de agua ahorrada este año</p>
          </div>

          <div className="eco-card flex flex-col items-center p-6 text-center">
            <div className="rounded-full bg-earth/10 p-4 mb-4">
              <Wind className="h-8 w-8 text-earth" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">Energía Conservada</h3>
            <p className="text-muted-foreground mb-4">
              Cada producto reutilizado significa menos energía consumida en la 
              fabricación de uno nuevo.
            </p>
            <div className="font-heading text-3xl font-bold text-earth mt-auto">
              +45,200 kWh
            </div>
            <p className="text-sm text-muted-foreground">de energía conservada</p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button className="bg-green hover:bg-green-dark">
            Calcula tu Huella Ecológica
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EcoImpact;
