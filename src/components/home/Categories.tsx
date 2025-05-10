
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, BookOpen, Home, Shirt, Gift, Coffee, Leaf, Bike, Smartphone, Book } from "lucide-react";

const categories = [
  { name: "Electrónica", icon: Smartphone, color: "bg-green-light/10 text-green" },
  { name: "Ropa", icon: Shirt, color: "bg-water-light/10 text-water" },
  { name: "Hogar", icon: Home, color: "bg-earth-light/10 text-earth" },
  { name: "Libros", icon: Book, color: "bg-green-light/10 text-green" },
  { name: "Deportes", icon: Bike, color: "bg-water-light/10 text-water" },
  { name: "Ecológicos", icon: Leaf, color: "bg-green/10 text-green" },
  { name: "Regalos", icon: Gift, color: "bg-earth/10 text-earth" },
  { name: "Alimentos", icon: Coffee, color: "bg-green-dark/10 text-green-dark" },
];

const Categories = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">Explora por Categorías</h2>
          <Link 
            to="/categories" 
            className="flex items-center text-green hover:text-green-dark font-medium"
          >
            Ver todas
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              to={`/category/${category.name.toLowerCase()}`} 
              className="group"
            >
              <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:-translate-y-1">
                <div className={`rounded-full p-4 mb-4 ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-medium group-hover:text-green">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
