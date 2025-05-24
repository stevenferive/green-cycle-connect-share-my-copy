// Contenedor de inyección de dependencias
import { UserRepository } from '../core/domain/repositories/UserRepository';
import { GetUserUseCase } from '../core/domain/usecases/GetUserUseCase';
import { CreateUserUseCase } from '../core/domain/usecases/CreateUserUseCase';
import { UserRepositoryImpl } from '../data/repositories/UserRepositoryImpl';
import { UserApi } from '../data/datasources/UserApi';
import { UserApiImpl } from '../infrastructure/http/UserApiImpl';
import { appConfig } from '../infrastructure/config/AppConfig';

// Configuración de la API
const API_URL = appConfig.apiUrl;

// Creación de instancias (normalmente esto lo haría una biblioteca de DI como Inversify)
const userApiInstance: UserApi = new UserApiImpl(API_URL);
const userRepositoryInstance: UserRepository = new UserRepositoryImpl(userApiInstance);

// Exportación de casos de uso ya configurados
export const getUserUseCase = new GetUserUseCase(userRepositoryInstance);
export const createUserUseCase = new CreateUserUseCase(userRepositoryInstance);

// Función para obtener dependencias
export const getDependencies = () => {
  return {
    userRepository: userRepositoryInstance,
    getUserUseCase,
    createUserUseCase
    // Podemos agregar más repositorios y casos de uso aquí
  };
}; 