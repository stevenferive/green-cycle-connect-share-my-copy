// Caso de uso en la capa de dominio
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  // El caso de uso implementa una regla de negocio específica
  async execute(userId: string): Promise<User | null> {
    if (!userId || userId.trim().length === 0) {
      throw new Error('El ID de usuario no puede estar vacío');
    }
    
    return this.userRepository.getUser(userId);
  }
} 