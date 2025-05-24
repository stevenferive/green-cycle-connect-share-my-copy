// Implementación del repositorio en la capa de datos
import { User } from '../../core/domain/entities/User';
import { UserRepository } from '../../core/domain/repositories/UserRepository';
import { UserApi } from '../datasources/UserApi';
import { UserMapper } from '../mappers/UserMapper';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userApi: UserApi) {}

  async getUser(id: string): Promise<User | null> {
    const userModel = await this.userApi.fetchUser(id);
    if (!userModel) return null;
    return UserMapper.toDomain(userModel);
  }

  async getUsers(): Promise<User[]> {
    const userModels = await this.userApi.fetchUsers();
    return userModels.map(userModel => UserMapper.toDomain(userModel));
  }

  async saveUser(user: User): Promise<void> {
    const userModel = UserMapper.toData(user);
    await this.userApi.createUser(userModel);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userApi.removeUser(id);
  }
} 