// Mapper para convertir entre el modelo de datos y la entidad de dominio
import { User } from '../../core/domain/entities/User';
import { UserModel } from '../models/UserModel';

export class UserMapper {
  // Convierte de modelo de datos a entidad de dominio
  static toDomain(userModel: UserModel): User {
    return new User(
      userModel.id,
      userModel.name,
      userModel.email,
      new Date(userModel.created_at)
    );
  }

  // Convierte de entidad de dominio a modelo de datos
  static toData(user: User): UserModel {
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      created_at: user.getCreatedAt().toISOString(),
      // No podemos incluir avatar_url porque no está en la entidad del dominio
    };
  }
} 