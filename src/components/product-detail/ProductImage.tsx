
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductImageProps {
  images: string[];
  title: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ images, title }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Si no hay imágenes, mostrar imagen por defecto
  const imageList = images.length > 0 ? images : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'];
  
  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };
  
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalPrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleModalNext = () => {
    setSelectedImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-4">
        {/* Imagen principal */}
        <div className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer" onClick={handleImageClick}>
          <img 
            src={imageList[selectedImageIndex]} 
            alt={`${title} - Imagen ${selectedImageIndex + 1}`}
            className="w-full h-96 object-cover"
          />
          
          {/* Controles de navegación - solo mostrar si hay más de una imagen */}
          {imageList.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviousImage();
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Indicador de imagen actual */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {selectedImageIndex + 1} / {imageList.length}
              </div>
            </>
          )}

          {/* Overlay para indicar que es clickeable */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
            <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Miniaturas - solo mostrar si hay más de una imagen */}
        {imageList.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {imageList.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative rounded overflow-hidden border-2 transition-all ${
                  index === selectedImageIndex 
                    ? 'border-green-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img 
                  src={image} 
                  alt={`${title} - Miniatura ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal para vista completa */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-0">
          <div className="relative">
            {/* Botón de cerrar */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={handleModalClose}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Imagen principal del modal */}
            <div className="relative flex items-center justify-center min-h-[80vh]">
              <img 
                src={imageList[selectedImageIndex]} 
                alt={`${title} - Vista completa ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Controles de navegación del modal */}
              {imageList.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-white/20"
                    onClick={handleModalPrevious}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-white/20"
                    onClick={handleModalNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  
                  {/* Indicador de imagen actual en modal */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                    {selectedImageIndex + 1} de {imageList.length}
                  </div>
                </>
              )}
            </div>

            {/* Miniaturas en el modal */}
            {imageList.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 p-4">
                {imageList.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative rounded overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex 
                        ? 'border-white shadow-lg' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${title} - Miniatura modal ${index + 1}`}
                      className="w-16 h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductImage;
