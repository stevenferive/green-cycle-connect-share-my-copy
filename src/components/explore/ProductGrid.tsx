
import React from "react";
import ProductCard from "@/components/products/ProductCard";

interface Product {
  id: string;
  title: string;
  seller: string;
  sellerId?: string;
  price: number;
  originalPrice?: number;
  location: string;
  image: string;
  category: string;
  ecoBadges?: string[];
  isFavorite?: boolean;
  isNew?: boolean;
  forBarter?: boolean;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-heading font-medium">No hay productos que coincidan con tu búsqueda</h2>
        <p className="text-muted-foreground mt-2">Intenta con otros filtros o términos de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
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
          isFavorite={product.isFavorite}
          isNew={product.isNew}
          forBarter={product.forBarter}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
