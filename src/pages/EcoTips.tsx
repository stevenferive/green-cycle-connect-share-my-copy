
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Leaf, Recycle, Home, ShoppingBag, Utensils, Droplet, Car, LightbulbIcon } from "lucide-react";

interface Tip {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  difficulty: "fácil" | "medio" | "avanzado";
  impact: "bajo" | "medio" | "alto";
}

const tips: Tip[] = [
  {
    id: "1",
    title: "Cómo crear tu propio compostaje casero",
    description: "Aprende a convertir tus residuos orgánicos en abono para tus plantas. El compostaje reduce la cantidad de basura que envías al vertedero y proporciona nutrientes naturales para tu jardín o plantas de interior.",
    category: "hogar",
    image: "https://images.unsplash.com/photo-1589466285596-c4064db10ced?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    difficulty: "medio",
    impact: "alto"
  },
  {
    id: "2",
    title: "Guía para compras a granel",
    description: "Descubre cómo reducir drásticamente los envases de un solo uso comprando alimentos y productos de limpieza a granel. Te explicamos qué contenedores son más adecuados y dónde encontrar tiendas que ofrezcan esta opción.",
    category: "consumo",
    image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    difficulty: "fácil",
    impact: "medio"
  },
  {
    id: "3",
    title: "Recetas para aprovechar restos de comida",
    description: "No tires esos restos de verduras o pan duro. Con estas recetas creativas, podrás convertir lo que normalmente desperdiciarías en deliciosos platos nutritivos, ahorrando dinero y reduciendo el desperdicio de alimentos.",
    category: "alimentacion",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    difficulty: "fácil",
    impact: "medio"
  },
  {
    id: "4",
    title: "Sistema de recolección de agua de lluvia",
    description: "Instrucciones paso a paso para crear un sistema simple pero efectivo de recolección de agua de lluvia. El agua recolectada puede usarse para regar el jardín, limpiar y otras tareas domésticas no potables.",
    category: "agua",
    image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    difficulty: "avanzado",
    impact: "alto"
  },
  {
    id: "5",
    title: "Cómo extender la vida útil de tu ropa",
    description: "Consejos prácticos sobre cómo cuidar tus prendas para que duren más tiempo, incluyendo técnicas de lavado, almacenamiento y reparación básica. La moda sostenible comienza con aprovechar al máximo lo que ya tienes.",
    category: "consumo",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    difficulty: "fácil",
    impact: "medio"
  },
  {
    id: "6",
    title: "Alternativas al transporte diario en auto",
    description: "Explora opciones como compartir coche, usar transporte público, bicicleta o caminar para reducir la huella de carbono de tus desplazamientos diarios. Incluye consejos para empezar y los beneficios para la salud y el ambiente.",
    category: "transporte",
    image: "https://images.unsplash.com/photo-1475666675596-cca2035b3d79?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    difficulty: "medio",
    impact: "alto"
  },
  {
    id: "7",
    title: "Creación de productos de limpieza naturales",
    description: "Recetas sencillas para elaborar limpiadores multiusos, detergentes y suavizantes usando ingredientes naturales como vinagre, bicarbonato y aceites esenciales. Menos químicos en tu hogar y menos envases plásticos.",
    category: "hogar",
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    difficulty: "fácil",
    impact: "medio"
  },
  {
    id: "8",
    title: "Jardín vertical con materiales reciclados",
    description: "Transforma botellas plásticas, pallets o tubos de PVC en un hermoso jardín vertical para tu balcón o patio. Este proyecto no solo recicla materiales, sino que también aporta verdor y posiblemente alimentos a tu espacio.",
    category: "hogar",
    image: "https://images.unsplash.com/photo-1525498128493-380d1990a112?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    difficulty: "medio",
    impact: "medio"
  },
  {
    id: "9",
    title: "Ahorro de energía en el hogar",
    description: "Pequeños cambios que pueden reducir significativamente tu consumo energético: desde ajustes en la temperatura de la calefacción y el aire acondicionado, hasta el uso eficiente de electrodomésticos y la elección de iluminación LED.",
    category: "energia",
    image: "https://images.unsplash.com/photo-1501159599894-155982264a55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    difficulty: "fácil",
    impact: "alto"
  }
];

const categories = [
  { id: "all", label: "Todos", icon: <Leaf className="h-4 w-4" /> },
  { id: "hogar", label: "Hogar", icon: <Home className="h-4 w-4" /> },
  { id: "consumo", label: "Consumo", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "alimentacion", label: "Alimentación", icon: <Utensils className="h-4 w-4" /> },
  { id: "agua", label: "Agua", icon: <Droplet className="h-4 w-4" /> },
  { id: "transporte", label: "Transporte", icon: <Car className="h-4 w-4" /> },
  { id: "energia", label: "Energía", icon: <LightbulbIcon className="h-4 w-4" /> }
];

const difficultyColors = {
  "fácil": "bg-green-light",
  "medio": "bg-yellow-400",
  "avanzado": "bg-orange-500"
};

const impactColors = {
  "bajo": "bg-blue-400",
  "medio": "bg-purple-500",
  "alto": "bg-pink-500"
};

const EcoTips = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const filteredTips = activeCategory === "all" 
    ? tips 
    : tips.filter(tip => tip.category === activeCategory);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-secondary py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Ecotips</h1>
              <p className="text-lg text-muted-foreground">
                Descubre consejos prácticos para vivir de manera más sostenible y reducir tu 
                impacto ambiental en el día a día. Pequeñas acciones pueden generar grandes cambios.
              </p>
            </div>
          </div>
        </section>
        
        <section className="container py-12">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <div className="flex justify-center mb-8">
              <TabsList className="overflow-auto">
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    {category.icon}
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTips.map(tip => (
                    <Card key={tip.id} className="overflow-hidden h-full">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={tip.image} 
                          alt={tip.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex gap-2 mb-3">
                          <Badge className={`${difficultyColors[tip.difficulty]}`}>
                            {tip.difficulty}
                          </Badge>
                          <Badge className={`${impactColors[tip.impact]}`}>
                            Impacto {tip.impact}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-heading font-semibold mb-2">{tip.title}</h3>
                        <p className="text-muted-foreground">{tip.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
        
        <section className="bg-secondary py-10">
          <div className="container">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-lg bg-background">
              <div>
                <h3 className="text-2xl font-heading font-semibold mb-2">¿Tienes un ecotip para compartir?</h3>
                <p className="text-muted-foreground">Ayuda a nuestra comunidad compartiendo tus mejores consejos sostenibles</p>
              </div>
              <button className="bg-green hover:bg-green-dark text-white px-6 py-3 rounded-md font-medium">
                Compartir un Ecotip
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EcoTips;
