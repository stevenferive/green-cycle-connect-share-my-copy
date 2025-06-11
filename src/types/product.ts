
export interface Location {
  city: string;
  region: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ShippingOptions {
  localPickup?: boolean;
  homeDelivery?: boolean;
  shipping?: boolean;
  shippingCost?: number;
}

export interface ProductMetadata {
  seoTitle?: string;
  seoDescription?: string;
}

export interface CreateProductDto {
  // Campos obligatorios
  name: string;
  description: string;
  slug: string;
  images: string[];
  category: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  seller: string;
  location: Location;
  
  // Campos opcionales
  price?: number;
  currency?: string;
  forBarter?: boolean;
  barterPreferences?: string[];
  stock?: number;
  stockUnit?: string;
  isUnlimitedStock?: boolean;
  ecoBadges?: string[];
  ecoSaving?: number;
  sustainabilityScore?: number;
  materials?: string[];
  isHandmade?: boolean;
  isOrganic?: boolean;
  shippingOptions?: ShippingOptions;
  tags?: string[];
  searchKeywords?: string[];
  metadata?: ProductMetadata;
}

export interface ProductValidationErrors {
  name?: string;
  description?: string;
  category?: string;
  condition?: string;
  location?: string;
  images?: string;
  price?: string;
  stock?: string;
  sustainabilityScore?: string;
  ecoBadges?: string;
}
