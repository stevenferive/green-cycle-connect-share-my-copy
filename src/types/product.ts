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
  name: string;
  description: string;
  slug: string;
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  price: number;
  location: {
    city: string;
    region: string;
  };
  // Campos opcionales que pueden ser enviados
  subcategory?: string;
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
  shippingOptions?: {
    localPickup?: boolean;
    homeDelivery?: boolean;
    shipping?: boolean;
    shippingCost?: number;
  };
  status?: 'draft' | 'active' | 'paused' | 'out_of_stock' | 'sold' | 'archived';
  tags?: string[];
  searchKeywords?: string[];
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
  };
}

export interface ProductValidationErrors {
  name?: string;
  description?: string;
  slug?: string;
  category?: string;
  condition?: string;
  location?: string;
  images?: string;
  price?: string;
  stock?: string;
  sustainabilityScore?: string;
  ecoBadges?: string;
  subcategory?: string;
  status?: string;
  currency?: string;
  shippingCost?: string;
}
