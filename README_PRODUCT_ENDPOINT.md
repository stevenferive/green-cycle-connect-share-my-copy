# 🚀 Endpoint POST /products - Guía de Uso

## 📋 Descripción

Este endpoint permite crear nuevos productos en Green Cycle Connect & Share. Incluye validaciones robustas, manejo de errores y soporte para carga de imágenes.

## 🔗 Endpoint

```
POST http://localhost:3000/products
```

## 🔑 Headers Requeridos

```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}" // JWT token de autenticación
}
```

## 📦 Body (JSON)

### Campos Obligatorios

```json
{
  "name": "string (3-100 caracteres)",
  "description": "string (10-1000 caracteres)", 
  "slug": "string (único, formato: a-z, 0-9, -)",
  "images": ["string[] (1-10 URLs de imágenes)"],
  "category": "string (ObjectId de MongoDB)",
  "condition": "string (enum: 'new', 'like_new', 'good', 'fair', 'poor')",
  "seller": "string (ObjectId de MongoDB)",
  "location": {
    "city": "string (requerido)",
    "region": "string (requerido)",
    "coordinates": {
      "lat": "number (opcional, -90 a 90)",
      "lng": "number (opcional, -180 a 180)"
    }
  }
}
```

### Campos Opcionales

```json
{
  "subcategory": "string (ObjectId de MongoDB)",
  "price": "number (mín: 0, default: 0)",
  "currency": "string (default: 'PEN', enum: 'PEN', 'USD', 'EUR')",
  "forBarter": "boolean (default: false)",
  "barterPreferences": ["string[]"],
  "stock": "number (mín: 0, default: 0)",
  "stockUnit": "string (default: 'unidad')",
  "isUnlimitedStock": "boolean (default: false)",
  "ecoBadges": ["string[] (máx: 5)"],
  "ecoSaving": "number",
  "sustainabilityScore": "number (1-100, default: 50)",
  "materials": ["string[]"],
  "isHandmade": "boolean (default: false)",
  "isOrganic": "boolean (default: false)",
  "shippingOptions": {
    "localPickup": "boolean (default: true)",
    "homeDelivery": "boolean (default: false)",
    "shipping": "boolean (default: false)",
    "shippingCost": "number (mín: 0)"
  },
  "status": "string (enum: 'draft', 'active', 'paused', 'out_of_stock', 'sold', 'archived', default: 'draft')",
  "isVerifiedSeller": "boolean (default: false)",
  "tags": ["string[]"],
  "searchKeywords": ["string[]"],
  "metadata": {
    "seoTitle": "string",
    "seoDescription": "string"
  }
}
```

## 💡 Ejemplo de Uso

### JavaScript/TypeScript

```javascript
// Función para crear producto
async function createProduct(productData) {
  try {
    const response = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Tu JWT token
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el producto');
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Ejemplo de datos
const newProduct = {
  name: "Compostera Ecológica",
  description: "Compostera hecha con materiales reciclados, perfecta para tu jardín urbano",
  slug: "compostera-ecologica-2024",
  images: [
    "https://ejemplo.com/imagen1.jpg",
    "https://ejemplo.com/imagen2.jpg"
  ],
  category: "507f1f77bcf86cd799439011", // ID de la categoría
  condition: "new",
  seller: "507f1f77bcf86cd799439012", // ID del vendedor
  location: {
    city: "Lima",
    region: "Lima",
    coordinates: {
      lat: -12.0464,
      lng: -77.0428
    }
  },
  price: 150.00,
  currency: "PEN",
  ecoBadges: ["reciclado", "biodegradable"],
  isHandmade: true,
  isOrganic: false,
  tags: ["compostera", "jardín", "ecológico"]
};

// Llamar a la función
createProduct(newProduct)
  .then(product => {
    console.log('Producto creado:', product);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### React con Hooks

```typescript
import { useCreateProduct } from '@/hooks/useCreateProduct';

const MyComponent = () => {
  const createProductMutation = useCreateProduct();

  const handleCreateProduct = async () => {
    const productData = {
      name: "Compostera Ecológica",
      description: "Compostera hecha con materiales reciclados...",
      slug: "compostera-ecologica-2024",
      images: ["https://ejemplo.com/imagen1.jpg"],
      category: "507f1f77bcf86cd799439011",
      condition: "new" as const,
      seller: "507f1f77bcf86cd799439012",
      location: {
        city: "Lima",
        region: "Lima"
      },
      price: 150.00,
      currency: "PEN",
      ecoBadges: ["reciclado", "biodegradable"],
      status: "draft" as const
    };

    try {
      const result = await createProductMutation.mutateAsync(productData);
      console.log('Producto creado:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button 
      onClick={handleCreateProduct}
      disabled={createProductMutation.isPending}
    >
      {createProductMutation.isPending ? 'Creando...' : 'Crear Producto'}
    </button>
  );
};
```

## 📊 Respuestas

### ✅ Éxito (201 Created)

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Compostera Ecológica",
  "description": "Compostera hecha con materiales reciclados...",
  "slug": "compostera-ecologica-2024",
  "images": ["url1.jpg", "url2.jpg"],
  "category": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jardín y Exterior",
    "slug": "jardin-exterior"
  },
  "condition": "new",
  "seller": "507f1f77bcf86cd799439012",
  "price": 150,
  "currency": "PEN",
  "status": "draft",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### ❌ Errores Comunes

#### 400 Bad Request - Validación fallida
```json
{
  "statusCode": 400,
  "message": ["name must be longer than or equal to 3 characters"],
  "error": "Bad Request"
}
```

#### 400 Bad Request - Slug duplicado
```json
{
  "statusCode": 400,
  "message": "Ya existe un producto con ese slug",
  "error": "Bad Request"
}
```

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 413 Payload Too Large
```json
{
  "statusCode": 413,
  "message": "Las imágenes son demasiado grandes",
  "error": "Payload Too Large"
}
```

## 🛡️ Validaciones

### Frontend (Cliente)
- ✅ Campos obligatorios
- ✅ Longitudes de texto (nombre: 3-100, descripción: 10-1000)
- ✅ Formato de slug (solo a-z, 0-9, -)
- ✅ Enums válidos (condition, status, currency)
- ✅ Rangos numéricos (precio ≥ 0, stock ≥ 0, sustainabilityScore 1-100)
- ✅ Máximo 5 eco badges
- ✅ Máximo 10 imágenes
- ✅ Coordenadas válidas (lat: -90 a 90, lng: -180 a 180)

### Backend (Servidor)
- ✅ Todos los campos obligatorios
- ✅ Tipos de datos correctos
- ✅ Enums válidos
- ✅ Referencias válidas (ObjectIds)
- ✅ Slug único en la base de datos
- ✅ Categoría y subcategoría válidas
- ✅ Vendedor autenticado

## 🔧 Endpoints Relacionados

### Verificar Slug Único
```
GET /products/check-slug/{slug}
```

### Subir Imagen
```
POST /products/upload-image
Content-Type: multipart/form-data
```

### Obtener Categorías
```
GET /categories
```

### Obtener Subcategorías
```
GET /categories/{categoryId}/subcategories
```

## 📝 Notas Importantes

1. **Autenticación**: Requiere token JWT válido
2. **Slug Único**: Debe ser único en toda la base de datos
3. **ObjectIds**: Los campos `category`, `subcategory` y `seller` deben ser ObjectIds válidos
4. **Imágenes**: Proporciona URLs válidas para las imágenes
5. **Estado**: Por defecto se crea como 'draft', puedes cambiarlo a 'active' para publicarlo
6. **Valores por Defecto**: Muchos campos opcionales tienen valores por defecto
7. **Validaciones**: El backend valida automáticamente todos los campos

## 🚀 Próximos Pasos

1. **Integrar con backend real**
2. **Implementar autenticación JWT**
3. **Agregar carga de imágenes**
4. **Implementar categorías dinámicas**
5. **Agregar geolocalización automática**

---

**¿Necesitas ayuda?** Revisa los ejemplos en `src/examples/` o consulta la documentación completa en `docs/PRODUCT_ENDPOINT_IMPLEMENTATION.md` 