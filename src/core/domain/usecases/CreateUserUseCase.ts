// Caso de uso para crear usuarios en la capa de dominio
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

// DTO para los datos de creación de usuario
export interface CreateUserDTO {
  name: string;
  email: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  // El caso de uso implementa la lógica de negocio para crear un usuario
  async execute({ name, email }: CreateUserDTO): Promise<User> {
    // Validaciones de reglas de negocio
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }

    if (!email || email.trim().length === 0) {
      throw new Error('El email no puede estar vacío');
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('El formato del email no es válido');
    }

    // Creación del usuario
    // En una implementación real, aquí se generaría un ID único
    const id = `user_${Date.now()}`;
    const createdAt = new Date();
    
    const newUser = new User(id, name, email, createdAt);
    
    // Guardar el usuario usando el repositorio
    await this.userRepository.saveUser(newUser);
    
    return newUser;
  }
} 