
import React from "react";

const ProductDescription: React.FC = () => {
  return (
    <div className="pt-4 border-t">
      <h3 className="font-heading font-semibold mb-2">Descripción</h3>
      <p className="text-muted-foreground">
        Este es un producto de segunda mano en excelente estado. 
        Al comprarlo contribuyes a reducir los residuos y el impacto ambiental.
      </p>
    </div>
  );
};

export default ProductDescription;
