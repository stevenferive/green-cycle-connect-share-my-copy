
import { Product } from "@/components/products/ProductCard";

export const sampleProducts: Product[] = [
  {
    id: "1",
    title: "Bicicleta urbana restaurada",
    price: 350,
    exchange: true,
    location: "Lima",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Transporte",
    ecoBadges: ["Restaurado", "Ahorro CO2"],
    ecoSaving: 45
  },
  {
    id: "2",
    title: "Macetas de bambú hechas a mano",
    price: 25,
    exchange: false,
    location: "Arequipa",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
    category: "Hogar",
    ecoBadges: ["Artesanal", "Material sostenible"],
    ecoSaving: 15
  },
  {
    id: "3",
    title: "Juego de muebles de palet reciclado",
    price: 580,
    exchange: true,
    location: "Cusco",
    image: "https://images.unsplash.com/photo-1533377379555-65bdad2fb9f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Muebles",
    ecoBadges: ["Reciclado", "Hecho a mano"],
    ecoSaving: 120
  },
  {
    id: "4",
    title: "Teléfono móvil reacondicionado",
    price: 280,
    exchange: false,
    location: "Lima",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1467&q=80",
    category: "Electrónica",
    ecoBadges: ["Reacondicionado", "E-waste reducido"],
    ecoSaving: 75
  },
  {
    id: "5",
    title: "Ropa vintage en excelente estado",
    price: 45,
    exchange: true,
    location: "Trujillo",
    image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Moda",
    ecoBadges: ["Segunda mano", "Slow fashion"],
    ecoSaving: 30
  },
  {
    id: "6",
    title: "Juguetes de madera ecológicos",
    price: 65,
    exchange: false,
    location: "Piura",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1475&q=80",
    category: "Niños",
    ecoBadges: ["Materiales orgánicos", "No tóxico"],
    ecoSaving: 25
  }
];

export const categories = [
  "Todos", "Hogar", "Moda", "Electrónica", "Muebles", 
  "Transporte", "Niños", "Jardín", "Libros", "Deportes"
];
