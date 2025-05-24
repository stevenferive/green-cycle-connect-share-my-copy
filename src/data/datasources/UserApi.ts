// Fuente de datos que se comunica con la API externa
import { UserModel } from '../models/UserModel';

export interface UserApi {
  fetchUser(id: string): Promise<UserModel | null>;
  fetchUsers(): Promise<UserModel[]>;
  createUser(user: UserModel): Promise<void>;
  removeUser(id: string): Promise<void>;
} 