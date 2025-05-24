// Interfaz del repositorio en la capa de dominio
import { User } from '../entities/User';

// Esta interfaz define los métodos que debe implementar cualquier repositorio de usuarios
export interface UserRepository {
  getUser(id: string): Promise<User | null>;
  getUsers(): Promise<User[]>;
  saveUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;
} 