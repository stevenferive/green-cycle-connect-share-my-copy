// Implementación concreta de la API en la capa de infraestructura
import axios from 'axios';
import { UserApi } from '../../data/datasources/UserApi';
import { UserModel } from '../../data/models/UserModel';

export class UserApiImpl implements UserApi {
  private readonly apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async fetchUser(id: string): Promise<UserModel | null> {
    try {
      const response = await axios.get<UserModel>(`${this.apiUrl}/users/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async fetchUsers(): Promise<UserModel[]> {
    const response = await axios.get<UserModel[]>(`${this.apiUrl}/users`);
    return response.data;
  }

  async createUser(user: UserModel): Promise<void> {
    await axios.post(`${this.apiUrl}/users`, user);
  }

  async removeUser(id: string): Promise<void> {
    await axios.delete(`${this.apiUrl}/users/${id}`);
  }
} 