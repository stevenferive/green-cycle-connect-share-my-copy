
export const mockProducts = [
  {
    id: '1',
    name: 'Bolsa Reutilizable de Algodón',
    description: 'Bolsa 100% algodón orgánico para compras',
    category: 'Orgánico',
    stock: 15,
    price: 25.00,
    forBarter: false,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    status: 'active' as const,
    publishedAt: '2024-01-15',
    views: 45,
    favorites: 8
  },
  {
    id: '2',
    name: 'Maceta de Material Reciclado',
    description: 'Maceta hecha con botellas plásticas recicladas',
    category: 'Reciclado',
    stock: 0,
    price: 0,
    forBarter: true,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    status: 'out_of_stock' as const,
    publishedAt: '2024-01-10',
    views: 32,
    favorites: 12
  },
  {
    id: '3',
    name: 'Jabón Artesanal de Lavanda',
    description: 'Jabón hecho a mano con ingredientes naturales',
    category: 'Artesanal',
    stock: 8,
    price: 15.00,
    forBarter: false,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    status: 'paused' as const,
    publishedAt: '2024-01-08',
    views: 28,
    favorites: 5
  }
];
