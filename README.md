# GreenCycle

## Arquitectura Limpia (Clean Architecture)

Este proyecto implementa los principios de Arquitectura Limpia (Clean Architecture) para mantener un código organizado, testeable y mantenible. La estructura está diseñada para separar las preocupaciones y hacer que el código sea independiente de frameworks y detalles de implementación.

### Estructura del Proyecto

```
src/
├── core/                    # Capa central (Domain)
│   ├── domain/
│   │   ├── entities/        # Entidades de negocio
│   │   ├── repositories/    # Interfaces de repositorios
│   │   ├── usecases/        # Casos de uso del negocio
│   │   └── value-objects/   # Objetos de valor
│
├── data/                    # Capa de datos (Data Layer)
│   ├── repositories/        # Implementaciones de repositorios
│   ├── datasources/         # Fuentes de datos (API, DB, etc.)
│   ├── models/              # Modelos de datos
│   └── mappers/             # Convertidores entre modelos y entidades
│
├── presentation/            # Capa de presentación
│   ├── pages/               # Páginas de la aplicación
│   ├── components/          # Componentes UI reutilizables
│   ├── hooks/               # Hooks personalizados
│   ├── providers/           # Proveedores de contexto
│   ├── navigation/          # Configuración de rutas
│   └── store/               # Estado global (si usas Redux/Zustand)
│
├── infrastructure/          # Capa de infraestructura
│   ├── http/                # Cliente HTTP (axios, fetch)
│   ├── storage/             # Almacenamiento local
│   ├── services/            # Servicios externos
│   └── config/              # Configuraciones
│
└── di/                      # Inyección de dependencias
    └── container.ts         # Configuración del contenedor DI
```

### Principios de la Arquitectura Limpia

1. **Independencia de Frameworks**: El núcleo de la aplicación no depende de ningún framework externo.
2. **Testabilidad**: Las capas están diseñadas para ser fácilmente testeables de forma aislada.
3. **Independencia de la UI**: La lógica de negocio funciona sin importar la interfaz de usuario.
4. **Independencia de la Base de Datos**: La lógica central no depende de ninguna base de datos específica.
5. **Independencia de cualquier agente externo**: El núcleo de negocio no conoce nada del mundo exterior.

### Flujo de Dependencias

Las dependencias fluyen desde las capas externas hacia las internas:

```
Infrastructure/Data → Domain ← Presentation
```

La capa de dominio no depende de ninguna otra capa, mientras que las capas externas dependen de las internas.

### Implementación Detallada

#### 1. Capa de Dominio (Core)

La capa de dominio contiene toda la lógica de negocio y es completamente independiente de frameworks externos.

##### Entidades

Las entidades representan los objetos centrales del negocio:

```typescript
// User.ts
export class User {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
    private readonly createdAt: Date
  ) {}

  getId(): string {
    return this.id;
  }

  // Métodos adicionales...
}
```

##### Value Objects

Objetos inmutables que encapsulan lógica de validación:

```typescript
// Email.ts
export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email | Error {
    if (!Email.isValid(value)) {
      return new Error('Email no válido');
    }
    
    return new Email(value);
  }

  // Métodos adicionales...
}
```

##### Repositories (Interfaces)

Definen contratos para acceder a los datos:

```typescript
// UserRepository.ts
export interface UserRepository {
  getUser(id: string): Promise<User | null>;
  getUsers(): Promise<User[]>;
  saveUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
```

##### Casos de Uso

Implementan la lógica específica del negocio:

```typescript
// GetUserUseCase.ts
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User | null> {
    if (!userId || userId.trim().length === 0) {
      throw new Error('El ID de usuario no puede estar vacío');
    }
    
    return this.userRepository.getUser(userId);
  }
}

// CreateUserUseCase.ts
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ name, email }: CreateUserDTO): Promise<User> {
    // Validaciones de reglas de negocio
    // ...
    
    const newUser = new User(id, name, email, createdAt);
    await this.userRepository.saveUser(newUser);
    
    return newUser;
  }
}
```

#### 2. Capa de Datos

Implementa las interfaces definidas en el dominio.

##### Modelos de Datos

```typescript
// UserModel.ts
export interface UserModel {
  id: string;
  name: string;
  email: string;
  created_at: string; // Formato diferente al de la entidad
  avatar_url?: string; // Campo adicional
}
```

##### Mappers

Convierten entre modelos de datos y entidades de dominio:

```typescript
// UserMapper.ts
export class UserMapper {
  static toDomain(userModel: UserModel): User {
    return new User(
      userModel.id,
      userModel.name,
      userModel.email,
      new Date(userModel.created_at)
    );
  }

  static toData(user: User): UserModel {
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      created_at: user.getCreatedAt().toISOString(),
    };
  }
}
```

##### Implementaciones de Repositorios

```typescript
// UserRepositoryImpl.ts
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userApi: UserApi) {}

  async getUser(id: string): Promise<User | null> {
    const userModel = await this.userApi.fetchUser(id);
    if (!userModel) return null;
    return UserMapper.toDomain(userModel);
  }

  // Otros métodos...
}
```

#### 3. Capa de Infraestructura

Implementa detalles técnicos como la comunicación con APIs o el almacenamiento.

##### Implementación de HTTP

```typescript
// UserApiImpl.ts
export class UserApiImpl implements UserApi {
  constructor(private readonly apiUrl: string) {}

  async fetchUser(id: string): Promise<UserModel | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/users/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Otros métodos...
}
```

##### Servicio de Almacenamiento Local

```typescript
// LocalStorageService.ts
export class LocalStorageService {
  static save<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  // Otros métodos...
}
```

##### Servicio de Notificaciones

```typescript
// NotificationService.ts
export class NotificationService {
  static success(message: string, title?: string): void {
    this.show({
      title,
      message,
      type: NotificationType.SUCCESS
    });
  }

  // Otros métodos...
}
```

#### 4. Capa de Presentación

Implementa la interfaz de usuario utilizando los casos de uso.

##### Hooks personalizados

```typescript
// useUser.ts
export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Utilizamos el caso de uso del dominio
        const userResult = await getUserUseCase.execute(userId);
        setUser(userResult);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { user, loading, error };
};
```

##### Proveedores de contexto

```typescript
// AuthProvider.tsx
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Métodos para login/logout usando casos de uso...
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

##### Gestión de estado global

```typescript
// userStore.ts
export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,
  
  fetchUser: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      
      // Utilizamos el caso de uso del dominio
      const user = await getUserUseCase.execute(userId);
      
      set({ user, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Error desconocido'), 
        loading: false 
      });
    }
  },
  
  // Otras acciones...
}));
```

#### 5. Inyección de Dependencias

Configura las dependencias respetando el principio de inversión de dependencias:

```typescript
// container.ts
// Configuración de la API
const API_URL = appConfig.apiUrl;

// Creación de instancias
const userApiInstance: UserApi = new UserApiImpl(API_URL);
const userRepositoryInstance: UserRepository = new UserRepositoryImpl(userApiInstance);

// Exportación de casos de uso ya configurados
export const getUserUseCase = new GetUserUseCase(userRepositoryInstance);
export const createUserUseCase = new CreateUserUseCase(userRepositoryInstance);
```

### Inyección de Dependencias

Para conectar las diferentes capas respetando las reglas de dependencia, utilizamos un contenedor de inyección de dependencias (en `src/di/container.ts`).

## Ventajas

- **Mantenibilidad**: Cambios en una capa no afectan a otras capas.
- **Escalabilidad**: Fácil de extender con nuevas funcionalidades.
- **Testabilidad**: Cada componente se puede probar de manera aislada.
- **Independencia tecnológica**: Fácil cambiar frameworks o bibliotecas externas.

## Cómo Empezar

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Ejecuta el proyecto: `npm run dev`

## Flujo de Desarrollo con Arquitectura Limpia

Para desarrollar una nueva funcionalidad siguiendo la arquitectura limpia:

1. **Define las entidades y reglas de negocio en la capa de dominio**
   - Crea las entidades necesarias
   - Define las interfaces de los repositorios
   - Implementa los casos de uso

2. **Implementa la capa de datos**
   - Crea los modelos de datos
   - Implementa los mappers
   - Implementa los repositorios

3. **Implementa la capa de infraestructura**
   - Crea los servicios necesarios
   - Implementa la comunicación con APIs externas
   - Configura el almacenamiento

4. **Implementa la capa de presentación**
   - Crea los hooks personalizados
   - Implementa los componentes
   - Configura las rutas

5. **Configura la inyección de dependencias**
   - Registra todas las implementaciones en el contenedor
   - Asegura que las dependencias fluyan correctamente

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
VITE_API_URL=https://tu-api.com
VITE_DEBUG=false
VITE_APP_VERSION=1.0.0
```

## Tecnologías

- React
- TypeScript
- Axios
- React Router
- Zustand (para gestión de estado)
- Vite

## Hecho con:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
