
import React from "react";

interface ProductImageProps {
  image: string;
  title: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, title }) => {
  return (
    <div className="rounded-lg overflow-hidden">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ProductImage;
