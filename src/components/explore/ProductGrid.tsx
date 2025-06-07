
import React from "react";
import ProductCard, { Product } from "@/components/products/ProductCard";

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
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
