
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  count: number;
}

const categories: Category[] = [
  {
    id: "hogar",
    name: "Hogar",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Artículos para el hogar reacondicionados y sostenibles",
    count: 245
  },
  {
    id: "moda",
    name: "Moda",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Ropa de segunda mano, vintage y sostenible",
    count: 312
  },
  {
    id: "electronica",
    name: "Electrónica",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Dispositivos electrónicos reacondicionados",
    count: 187
  },
  {
    id: "muebles",
    name: "Muebles",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Muebles restaurados, reciclados y sostenibles",
    count: 156
  },
  {
    id: "transporte",
    name: "Transporte",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Bicicletas, patinetes y opciones de movilidad sostenible",
    count: 98
  },
  {
    id: "ninos",
    name: "Niños",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Juguetes, ropa y accesorios para niños de segunda mano",
    count: 223
  },
  {
    id: "jardin",
    name: "Jardín",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Herramientas y accesorios para jardín sostenibles",
    count: 129
  },
  {
    id: "libros",
    name: "Libros",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Libros de segunda mano en buen estado",
    count: 276
  },
  {
    id: "deportes",
    name: "Deportes",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Equipamiento deportivo de segunda mano",
    count: 167
  },
  {
    id: "arte",
    name: "Arte",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
    description: "Obras de arte y artesanías sostenibles",
    count: 93
  }
];

const Categories = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Categorías</h1>
        <p className="text-muted-foreground mb-8">Explora nuestras categorías de productos ecoamigables y de segunda mano</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/explore?category=${category.id}`}
              className="transition-transform hover:-translate-y-1"
            >
              <Card className="overflow-hidden h-full">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading font-semibold text-lg">{category.name}</h3>
                    <span className="text-sm text-muted-foreground">{category.count} productos</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
