import { api } from '../api';

// Interfaces para el servicio de usuarios
export interface SearchableUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  city?: string;
  country?: string;
  description?: string;
  ecoInterests?: string[];
  rating?: number;
  reviewsCount?: number;
  productsCount?: number;
}

export interface UserSearchParams {
  q: string; // Query de búsqueda
  limit?: number;
  page?: number;
  filters?: {
    city?: string;
    country?: string;
    interests?: string[];
  };
}

export interface UserSearchResponse {
  users: SearchableUser[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export class UserService {
  // Buscar usuarios por nombre, email o ubicación
  static async searchUsers(params: UserSearchParams): Promise<UserSearchResponse> {
    try {
      // Obtener todos los usuarios usando el endpoint GET /user
      const allUsers: SearchableUser[] = await api.get('/user');
      
      // Filtrar usuarios en el frontend
      const filteredUsers = UserService.filterUsers(allUsers, params);
      
      // Aplicar paginación
      const limit = params.limit || 10;
      const page = params.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        users: paginatedUsers,
        total: filteredUsers.length,
        page,
        limit,
        hasNextPage: endIndex < filteredUsers.length
      };
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      
      // Fallback con datos mock para desarrollo
      if (params.q.length >= 2) {
        return UserService.getMockUsers(params);
      }
      
      throw error;
    }
  }

  // Método para filtrar usuarios en el frontend
  private static filterUsers(users: SearchableUser[], params: UserSearchParams): SearchableUser[] {
    const query = params.q.toLowerCase();
    
    let filteredUsers = users.filter(user => {
      // Búsqueda por texto en múltiples campos
      const matchesQuery = (
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.city?.toLowerCase().includes(query) ||
        user.country?.toLowerCase().includes(query) ||
        user.description?.toLowerCase().includes(query) ||
        user.ecoInterests?.some(interest => interest.toLowerCase().includes(query))
      );

      if (!matchesQuery) return false;

      // Aplicar filtros adicionales si existen
      if (params.filters) {
        if (params.filters.city && user.city !== params.filters.city) {
          return false;
        }
        
        if (params.filters.country && user.country !== params.filters.country) {
          return false;
        }
        
        if (params.filters.interests && params.filters.interests.length > 0) {
          const hasMatchingInterest = params.filters.interests.some(filterInterest =>
            user.ecoInterests?.some(userInterest => 
              userInterest.toLowerCase().includes(filterInterest.toLowerCase())
            )
          );
          if (!hasMatchingInterest) return false;
        }
      }

      return true;
    });

    return filteredUsers;
  }

  // Obtener información detallada de un usuario
  static async getUserById(userId: string): Promise<SearchableUser> {
    try {
      // Primero intentar con endpoint específico
      const response = await api.get(`/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      
      // Fallback: buscar en la lista de todos los usuarios
      try {
        const allUsers: SearchableUser[] = await api.get('/user');
        const user = allUsers.find(u => u._id === userId);
        if (user) {
          return user;
        }
        throw new Error('Usuario no encontrado');
      } catch (fallbackError) {
        console.error('Error en fallback para obtener usuario:', fallbackError);
        throw error;
      }
    }
  }

  // Obtener usuarios recomendados
  static async getRecommendedUsers(limit: number = 10): Promise<SearchableUser[]> {
    try {
      // Obtener todos los usuarios y devolver una muestra aleatoria
      const allUsers: SearchableUser[] = await api.get('/user');
      
      // Mezclar aleatoriamente y tomar los primeros 'limit' usuarios
      const shuffled = [...allUsers].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Error al obtener usuarios recomendados:', error);
      
      // Fallback con datos mock
      return UserService.getMockUsers({ q: '', limit }).users;
    }
  }

  // Datos mock para desarrollo y fallback
  private static getMockUsers(params: UserSearchParams): UserSearchResponse {
    const mockUsers: SearchableUser[] = [
      {
        _id: '64a1b2c3d4e5f6789abcdef1',
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@email.com',
        avatar: '/lovable-uploads/117c21d0-7e1c-4db0-9d91-dafa39c4f63e.png',
        city: 'Medellín',
        country: 'Colombia',
        description: 'Apasionada por el reciclaje y la sostenibilidad. Colecciono antiguedades y artículos vintage.',
        ecoInterests: ['reciclaje', 'upcycling', 'vintage'],
        rating: 4.7,
        reviewsCount: 45,
        productsCount: 12
      },
      {
        _id: '64a1b2c3d4e5f6789abcdef2',
        firstName: 'Carlos',
        lastName: 'Ruiz',
        email: 'carlos.ruiz@email.com',
        city: 'Bogotá',
        country: 'Colombia',
        description: 'Vendedor especializado en artículos vintage y antigüedades. Más de 5 años de experiencia.',
        ecoInterests: ['vintage', 'restauración', 'antigüedades'],
        rating: 4.9,
        reviewsCount: 32,
        productsCount: 8
      },
      {
        _id: '64a1b2c3d4e5f6789abcdef3',
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@email.com',
        city: 'Cali',
        country: 'Colombia',
        description: 'Entusiasta del intercambio de libros y artículos educativos. Promotora de la economía circular.',
        ecoInterests: ['intercambio', 'libros', 'educación'],
        rating: 4.5,
        reviewsCount: 28,
        productsCount: 15
      },
      {
        _id: '64a1b2c3d4e5f6789abcdef4',
        firstName: 'Diego',
        lastName: 'López',
        email: 'diego.lopez@email.com',
        city: 'Barranquilla',
        country: 'Colombia',
        description: 'Especialista en electrónicos reacondicionados y tecnología sostenible.',
        ecoInterests: ['tecnología', 'electrónicos', 'reacondicionado'],
        rating: 4.8,
        reviewsCount: 67,
        productsCount: 23
      },
      {
        _id: '64a1b2c3d4e5f6789abcdef5',
        firstName: 'Lucía',
        lastName: 'Herrera',
        email: 'lucia.herrera@email.com',
        city: 'Cartagena',
        country: 'Colombia',
        description: 'Artista que transforma materiales reciclados en obras de arte únicas.',
        ecoInterests: ['arte', 'reciclaje', 'creatividad'],
        rating: 4.6,
        reviewsCount: 19,
        productsCount: 7
      }
    ];

    // Filtrar usuarios por query de búsqueda
    const filteredUsers = mockUsers.filter(user => {
      const query = params.q.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.city?.toLowerCase().includes(query) ||
        user.description?.toLowerCase().includes(query) ||
        user.ecoInterests?.some(interest => interest.toLowerCase().includes(query))
      );
    });

    const limit = params.limit || 10;
    const page = params.page || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
      hasNextPage: endIndex < filteredUsers.length
    };
  }

  // Función auxiliar para obtener las iniciales de un usuario
  static getUserInitials(user: SearchableUser): string {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  }

  // Función auxiliar para obtener el nombre completo de un usuario
  static getUserFullName(user: SearchableUser): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }
} 