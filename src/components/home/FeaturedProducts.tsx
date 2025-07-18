
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

const dummyProducts = [
  {
    id: "1",
    title: "Monitor Samsung 24\" Full HD - Perfecto estado",
    price: 79.99,
    originalPrice: 120,
    seller: "TechRecycle",
    sellerId: "seller-1",
    location: "Madrid",
    image: "https://images.unsplash.com/photo-1527443060795-0402a18106c2?auto=format&fit=crop&q=80",
    category: "Electrónica",
    ecoBadges: ["Renovado", "Bajo Consumo"],
    isNew: true,
    forBarter: false
  },
  {
    id: "2",
    title: "Bicicleta de montaña ecológica",
    price: 120,
    seller: "EcoBikes",
    sellerId: "seller-2",
    location: "Barcelona",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80",
    category: "Deportes",
    ecoBadges: ["Materiales Reciclados", "Transporte Sostenible"],
    forBarter: true
  },
  {
    id: "3",
    title: "Set de jardinería completo",
    price: 45,
    seller: "GreenGarden",
    sellerId: "seller-3",
    location: "Valencia",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80",
    category: "Hogar",
    ecoBadges: ["Orgánico", "Biodegradable"],
    forBarter: false
  },
  {
    id: "4",
    title: "Smartphone Pixel 5 - Como nuevo",
    price: 199.99,
    originalPrice: 299.99,
    seller: "MobileReuse",
    sellerId: "seller-4",
    location: "Sevilla",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80",
    category: "Electrónica",
    ecoBadges: ["Renovado", "Eficiente"],
    forBarter: false
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">Productos Destacados</h2>
          <Link 
            to="/explore" 
            className="flex items-center text-green hover:text-green-dark font-medium"
          >
            Ver más
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyProducts.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              title={product.title}
              seller={product.seller}
              sellerId={product.sellerId}
              price={product.price}
              originalPrice={product.originalPrice}
              location={product.location}
              image={product.image}
              category={product.category}
              ecoBadges={product.ecoBadges}
              isNew={product.isNew}
              forBarter={product.forBarter}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
