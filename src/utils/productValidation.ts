
import { CreateProductDto, ProductValidationErrors } from '@/types/product';

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
    .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones por un solo guión
    .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final
};

export const validateProduct = (product: Partial<CreateProductDto>): ProductValidationErrors => {
  const errors: ProductValidationErrors = {};

  // Validar nombre
  if (!product.name?.trim()) {
    errors.name = 'El nombre del producto es obligatorio';
  } else if (product.name.length < 3 || product.name.length > 100) {
    errors.name = 'El nombre debe tener entre 3 y 100 caracteres';
  }

  // Validar descripción
  if (!product.description?.trim()) {
    errors.description = 'La descripción es obligatoria';
  } else if (product.description.length < 10 || product.description.length > 1000) {
    errors.description = 'La descripción debe tener entre 10 y 1000 caracteres';
  }

  // Validar categoría
  if (!product.category?.trim()) {
    errors.category = 'La categoría es obligatoria';
  }

  // Validar condición
  if (!product.condition) {
    errors.condition = 'La condición del producto es obligatoria';
  }

  // Validar ubicación
  if (!product.location?.city?.trim() || !product.location?.region?.trim()) {
    errors.location = 'La ciudad y región son obligatorias';
  }

  // Validar imágenes
  if (!product.images || product.images.length === 0) {
    errors.images = 'Debe agregar al menos una imagen';
  } else if (product.images.length > 10) {
    errors.images = 'Máximo 10 imágenes permitidas';
  }

  // Validar precio (si se proporciona)
  if (product.price !== undefined && product.price < 0) {
    errors.price = 'El precio debe ser mayor o igual a 0';
  }

  // Validar stock (si se proporciona)
  if (product.stock !== undefined && product.stock < 0) {
    errors.stock = 'El stock debe ser mayor o igual a 0';
  }

  // Validar sustainability score (si se proporciona)
  if (product.sustainabilityScore !== undefined && 
      (product.sustainabilityScore < 1 || product.sustainabilityScore > 100)) {
    errors.sustainabilityScore = 'La puntuación de sostenibilidad debe estar entre 1 y 100';
  }

  // Validar eco badges (si se proporcionan)
  if (product.ecoBadges && product.ecoBadges.length > 5) {
    errors.ecoBadges = 'Máximo 5 insignias ecológicas permitidas';
  }

  return errors;
};

export const hasValidationErrors = (errors: ProductValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};
