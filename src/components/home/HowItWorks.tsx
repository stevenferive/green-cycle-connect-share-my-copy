import React from "react";
import { Camera, Search, RefreshCw, Truck } from "lucide-react";
const HowItWorks = () => {
  return <section className="py-12 md:py-16">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading text-2xl font-bold md:text-3xl mb-4">
            ¿Cómo Funciona GreenCycle?
          </h2>
          <p className="text-muted-foreground">
            Nuestra plataforma hace que reutilizar, intercambiar y vender productos sea 
            fácil, seguro y beneficioso para el medio ambiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-light/10 mb-6">
              <Camera className="h-8 w-8 text-green" />
            </div>
            <div className="relative mb-8 h-0.5 w-24 bg-muted md:absolute md:right-0 md:top-8 md:w-full md:translate-x-1/2">
              <div className="absolute -right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-green md:right-0"></div>
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">
              Sube tu Producto
            </h3>
            <p className="text-muted-foreground">
              Toma fotos, describe tu producto y establece un precio o indica si estás abierto a intercambios.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-light/10 mb-6">
              <Search className="h-8 w-8 text-green" />
            </div>
            <div className="relative mb-8 h-0.5 w-24 bg-muted md:absolute md:right-0 md:top-8 md:w-full md:translate-x-1/2">
              
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">
              Conecta con Compradores
            </h3>
            <p className="text-muted-foreground">
              Los interesados te contactarán para hacer preguntas o realizar ofertas por tu producto.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-light/10 mb-6">
              <RefreshCw className="h-8 w-8 text-green" />
            </div>
            
            <h3 className="font-heading text-xl font-semibold mb-2">
              Negocia o Intercambia
            </h3>
            <p className="text-muted-foreground">
              Acuerda un precio final o un trueque que sea beneficioso para ambas partes.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-light/10 mb-6">
              <Truck className="h-8 w-8 text-green" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">
              Completa la Transacción
            </h3>
            <p className="text-muted-foreground">
              Entrega el producto de forma local o envíalo con nuestro sistema de pago seguro.
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;