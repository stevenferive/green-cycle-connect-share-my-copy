
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Recycle, Heart, Users, ShieldCheck, Leaf, BarChart } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Nuestra Misión</h1>
              <p className="text-lg text-muted-foreground">
                En GreenCycle creemos que cada pequeña acción cuenta para crear un planeta más sostenible. 
                Nuestra misión es facilitar la economía circular, promoviendo la reutilización 
                de productos y reduciendo el impacto ambiental del consumo.
              </p>
            </div>
          </div>
        </section>
        
        {/* Historia */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-4">Nuestra Historia</h2>
                <p className="text-muted-foreground mb-4">
                  GreenCycle nació en 2023 como una iniciativa de un grupo de jóvenes peruanos 
                  preocupados por el medio ambiente y el consumo excesivo. Inspirados por los 
                  principios de la economía circular, decidimos crear una plataforma que conectara a 
                  personas interesadas en dar una segunda vida a sus objetos.
                </p>
                <p className="text-muted-foreground mb-4">
                  Lo que comenzó como un pequeño proyecto local en Lima, rápidamente se expandió a 
                  otras ciudades del Perú, creando una comunidad vibrante de personas comprometidas 
                  con el consumo responsable y la sostenibilidad.
                </p>
                <p className="text-muted-foreground">
                  Hoy, GreenCycle es un referente en el mercado de segunda mano con conciencia 
                  ecológica, y continuamos creciendo con el objetivo de hacer del mundo un lugar 
                  más sostenible, una transacción a la vez.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                  alt="Equipo de GreenCycle" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Valores */}
        <section className="bg-secondary py-16">
          <div className="container">
            <h2 className="text-3xl font-heading font-bold mb-10 text-center">Nuestros Valores</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Leaf className="h-10 w-10 text-green" />,
                  title: "Sostenibilidad",
                  description: "Promovemos prácticas que reduzcan nuestra huella ecológica y preserven recursos naturales."
                },
                {
                  icon: <Recycle className="h-10 w-10 text-green" />,
                  title: "Economía Circular",
                  description: "Creemos en extender la vida útil de los productos, reduciendo residuos y aprovechando al máximo los recursos."
                },
                {
                  icon: <Users className="h-10 w-10 text-green" />,
                  title: "Comunidad",
                  description: "Fomentamos una comunidad colaborativa donde compartir y reutilizar genera conexiones significativas."
                },
                {
                  icon: <Heart className="h-10 w-10 text-green" />,
                  title: "Empatía",
                  description: "Actuamos con respeto hacia las personas y el planeta, entendiendo nuestro impacto global."
                },
                {
                  icon: <ShieldCheck className="h-10 w-10 text-green" />,
                  title: "Confianza",
                  description: "Construimos un entorno seguro y transparente para todas las interacciones en nuestra plataforma."
                },
                {
                  icon: <BarChart className="h-10 w-10 text-green" />,
                  title: "Impacto Medible",
                  description: "Cuantificamos y comunicamos el impacto positivo de cada transacción en términos ambientales."
                }
              ].map((value, index) => (
                <div key={index} className="bg-background rounded-lg p-6 shadow-sm">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Impacto */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-heading font-bold mb-4">Nuestro Impacto</h2>
              <p className="text-muted-foreground mb-8">
                Cada vez que alguien compra o intercambia un producto usado en lugar de uno nuevo, 
                se genera un impacto positivo en el planeta. En GreenCycle, nos enorgullece cuantificar 
                y mostrar ese impacto.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "15k+", label: "Usuarios activos" },
                  { value: "50k+", label: "Productos intercambiados" },
                  { value: "125t", label: "CO₂ evitado" },
                  { value: "500t", label: "Residuos evitados" }
                ].map((stat, index) => (
                  <div key={index} className="bg-secondary rounded-lg p-4">
                    <div className="text-3xl font-heading font-bold text-green">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Equipo */}
        <section className="bg-secondary py-16">
          <div className="container">
            <h2 className="text-3xl font-heading font-bold mb-10 text-center">Nuestro Equipo</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Bruss Antonio Silva Riofrio",
                  role: "Fundador & CEO",
                  image: "/lovable-uploads/117c21d0-7e1c-4db0-9d91-dafa39c4f63e.png"
                },
                {
                  name: "García Valdiviezo Dalessandro",
                  role: "Dir. de Sostenibilidad",
                  image: "/lovable-uploads/3763f33a-0698-4904-89db-fd16ba50b297.png"
                },
                {
                  name: "Aarón Leonardo Palacios Cabredo",
                  role: "CTO",
                  image: "/lovable-uploads/d613a947-c6dd-452f-8e85-6f6680c68cdd.png"
                },
                {
                  name: "Steven Modesto Febre Rivera",
                  role: "Dir. de Operaciones",
                  image: "/lovable-uploads/2afc4aac-da4d-48b8-8aec-4b8241e62c0c.png"
                }
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 mx-auto rounded-full overflow-hidden w-40 h-40">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-heading font-semibold">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
