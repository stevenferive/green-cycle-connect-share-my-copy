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

  // Validar slug
  if (!product.slug?.trim()) {
    errors.slug = 'El slug es obligatorio';
  } else if (product.slug.length < 3 || product.slug.length > 100) {
    errors.slug = 'El slug debe tener entre 3 y 100 caracteres';
  } else if (!/^[a-z0-9-]+$/.test(product.slug)) {
    errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
  }

  // Validar categoría
  if (!product.category?.trim()) {
    errors.category = 'La categoría es obligatoria';
  }

  // Validar condición
  if (!product.condition) {
    errors.condition = 'La condición del producto es obligatoria';
  } else if (!['new', 'used', 'refurbished'].includes(product.condition)) {
    errors.condition = 'La condición debe ser: new, used o refurbished';
  }

  // Validar ubicación
  if (!product.location?.city?.trim() || !product.location?.region?.trim()) {
    errors.location = 'La ciudad y región son obligatorias';
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

  // Validar status (si se proporciona)
  if (product.status && !['draft', 'active', 'paused', 'out_of_stock', 'sold', 'archived'].includes(product.status)) {
    errors.status = 'El estado debe ser: draft, active, paused, out_of_stock, sold o archived';
  }

  // Validar currency (si se proporciona)
  if (product.currency && !['PEN', 'USD', 'EUR'].includes(product.currency)) {
    errors.currency = 'La moneda debe ser: PEN, USD o EUR';
  }

  // Validar shipping cost (si se proporciona)
  if (product.shippingOptions?.shippingCost !== undefined && product.shippingOptions.shippingCost < 0) {
    errors.shippingCost = 'El costo de envío debe ser mayor o igual a 0';
  }

  return errors;
};

// Nueva función para validar productos con imágenes cargadas como archivos
export const validateProductWithFiles = (
  product: Partial<CreateProductDto>, 
  imageFiles: File[]
): ProductValidationErrors => {
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

  // Validar slug
  if (!product.slug?.trim()) {
    errors.slug = 'El slug es obligatorio';
  } else if (product.slug.length < 3 || product.slug.length > 100) {
    errors.slug = 'El slug debe tener entre 3 y 100 caracteres';
  } else if (!/^[a-z0-9-]+$/.test(product.slug)) {
    errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
  }

  // Validar categoría
  if (!product.category?.trim()) {
    errors.category = 'La categoría es obligatoria';
  }

  // Validar condición
  if (!product.condition) {
    errors.condition = 'La condición del producto es obligatoria';
  } else if (!['new', 'used', 'refurbished'].includes(product.condition)) {
    errors.condition = 'La condición debe ser: new, used o refurbished';
  }

  // Validar ubicación
  if (!product.location?.city?.trim() || !product.location?.region?.trim()) {
    errors.location = 'La ciudad y región son obligatorias';
  }

  // Validar imágenes (considerando archivos cargados)
  if (imageFiles.length === 0) {
    errors.images = 'Debe agregar al menos una imagen';
  } else if (imageFiles.length > 10) {
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

  // Validar status (si se proporciona)
  if (product.status && !['draft', 'active', 'paused', 'out_of_stock', 'sold', 'archived'].includes(product.status)) {
    errors.status = 'El estado debe ser: draft, active, paused, out_of_stock, sold o archived';
  }

  // Validar currency (si se proporciona)
  if (product.currency && !['PEN', 'USD', 'EUR'].includes(product.currency)) {
    errors.currency = 'La moneda debe ser: PEN, USD o EUR';
  }

  // Validar shipping cost (si se proporciona)
  if (product.shippingOptions?.shippingCost !== undefined && product.shippingOptions.shippingCost < 0) {
    errors.shippingCost = 'El costo de envío debe ser mayor o igual a 0';
  }

  return errors;
};

export const hasValidationErrors = (errors: ProductValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const validateImageFile = (file: File): string | null => {
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    return 'El archivo debe ser una imagen';
  }

  // Validar tamaño (5MB máximo)
  if (file.size > 5 * 1024 * 1024) {
    return 'La imagen no puede ser mayor a 5MB';
  }

  // Validar extensiones permitidas
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    return 'Solo se permiten archivos JPG, PNG y WebP';
  }

  return null;
};
