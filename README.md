# 🌱 GreenCycle

## 📋 Resumen del Proyecto

**GreenCycle** es una plataforma de comercio sostenible que conecta a personas interesadas en el reciclaje, la reutilización y el consumo responsable. La aplicación permite a los usuarios comprar, vender e intercambiar productos de segunda mano, promoviendo la economía circular y la sostenibilidad ambiental.

### 🎯 Características Principales

- **🛍️ Marketplace Sostenible**: Compra y venta de productos de segunda mano
- **♻️ Intercambio de Productos**: Sistema de trueque integrado
- **📍 Geolocalización**: Encuentra productos cerca de ti
- **💬 Chat en Tiempo Real**: Comunicación directa entre compradores y vendedores
- **🌿 Eco-Badges**: Sistema de certificaciones ambientales
- **📱 Diseño Responsivo**: Optimizado para móviles y desktop
- **🔐 Autenticación Segura**: Sistema de login/registro con JWT

## 🏗️ Arquitectura Limpia (Clean Architecture)

Este proyecto implementa los principios de **Arquitectura Limpia** para mantener un código organizado, testeable y mantenible. La estructura está diseñada para separar las preocupaciones y hacer que el código sea independiente de frameworks y detalles de implementación.

### 📁 Estructura del Proyecto

```
src/
├── core/                    # 🎯 Capa central (Domain)
│   ├── domain/
│   │   ├── entities/        # Entidades de negocio
│   │   ├── repositories/    # Interfaces de repositorios
│   │   ├── usecases/        # Casos de uso del negocio
│   │   └── value-objects/   # Objetos de valor
│
├── data/                    # 📊 Capa de datos (Data Layer)
│   ├── repositories/        # Implementaciones de repositorios
│   ├── datasources/         # Fuentes de datos (API, DB, etc.)
│   ├── models/              # Modelos de datos
│   └── mappers/             # Convertidores entre modelos y entidades
│
├── presentation/            # 🎨 Capa de presentación
│   ├── pages/               # Páginas de la aplicación
│   ├── components/          # Componentes UI reutilizables
│   ├── hooks/               # Hooks personalizados
│   ├── providers/           # Proveedores de contexto
│   ├── navigation/          # Configuración de rutas
│   └── store/               # Estado global
│
├── infrastructure/          # 🔧 Capa de infraestructura
│   ├── http/                # Cliente HTTP (axios, fetch)
│   ├── storage/             # Almacenamiento local
│   ├── services/            # Servicios externos
│   └── config/              # Configuraciones
│
├── components/              # 🧩 Componentes UI
│   ├── ui/                  # Componentes base (shadcn/ui)
│   ├── layout/              # Componentes de layout
│   ├── products/            # Componentes de productos
│   ├── chat/                # Componentes de chat
│   └── ...                  # Otros componentes
│
├── hooks/                   # 🎣 Hooks personalizados
├── services/                # 🔌 Servicios de API
├── types/                   # 📝 Tipos TypeScript
├── utils/                   # 🛠️ Utilidades
└── di/                      # 💉 Inyección de dependencias
    └── container.ts         # Configuración del contenedor DI
```

### 🔄 Flujo de Dependencias

Las dependencias fluyen desde las capas externas hacia las internas:

```
Infrastructure/Data → Domain ← Presentation
```

La capa de dominio no depende de ninguna otra capa, mientras que las capas externas dependen de las internas.

## 🚀 Cómo Clonar e Iniciar el Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/SZARES/green-cycle-connect-share.git
cd green-cycle-connect-share
```

### 2. Instalar Dependencias

```bash
npm install

```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto o modifica api.ts:

```env
VITE_API_URL={ tu URL]
VITE_DEBUG=false
VITE_APP_VERSION=1.0.0
```

### 4. Ejecutar el Proyecto

```bash
# Desarrollo
npm run dev
```

### 5. Acceder a la Aplicación

Abre tu navegador y ve a: `http://localhost:5173`

## 🔌 Endpoints de la API

### Base URL
```
http://localhost:3000
```

### 🔐 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Iniciar sesión |
| `POST` | `/auth/register` | Registrar usuario |
| `POST` | `/auth/logout` | Cerrar sesión |

### 📦 Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/products` | Obtener todos los productos |
| `GET` | `/products/:id` | Obtener producto específico |
| `POST` | `/products` | Crear nuevo producto |
| `PUT` | `/products/:id` | Actualizar producto |
| `DELETE` | `/products/:id` | Eliminar producto |
| `POST` | `/products/with-images` | Crear producto con imágenes |
| `GET` | `/products/check-slug/:slug` | Verificar slug único |

### 🛒 Carrito de Compras

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/cart` | Obtener carrito del usuario |
| `POST` | `/cart/add` | Agregar producto al carrito |
| `PATCH` | `/cart/item/:productId` | Actualizar cantidad |
| `DELETE` | `/cart/item/:productId` | Eliminar item del carrito |
| `POST` | `/cart/checkout` | Procesar compra |

### 📋 Órdenes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/orders/seller/pending` | Órdenes pendientes del vendedor |
| `GET` | `/orders/buyer/all` | Todas las órdenes del comprador |
| `GET` | `/orders/:id` | Obtener orden específica |
| `PATCH` | `/orders/:id/approve` | Aprobar orden |
| `PATCH` | `/orders/:id/reject` | Rechazar orden |
| `PATCH` | `/orders/:id/delivered` | Confirmar entrega |

### 👥 Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/user` | Obtener todos los usuarios |
| `GET` | `/user/:id` | Obtener usuario específico |
| `PUT` | `/user/:id` | Actualizar perfil de usuario |
| `DELETE` | `/user/:id` | Eliminar usuario |

### 💬 Chat

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/chats` | Obtener chats del usuario |
| `POST` | `/chats` | Crear nuevo chat |
| `GET` | `/chats/:id/messages` | Obtener mensajes del chat |
| `POST` | `/chats/:id/messages` | Enviar mensaje |

### 🏷️ Categorías

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/categories` | Obtener todas las categorías |
| `GET` | `/categories/:id/subcategories` | Obtener subcategorías |

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **React Hook Form** - Formularios

### UI/UX
- **Tailwind CSS** - Framework de CSS
- **shadcn/ui** - Componentes UI
- **Radix UI** - Componentes primitivos
- **Lucide React** - Iconos
- **Sonner** - Notificaciones toast

### Comunicación
- **Axios** - Cliente HTTP
- **Socket.io** - WebSockets para chat en tiempo real

### Desarrollo
- **TypeScript** - Compilador y tipado

## 🎯 Principios de la Arquitectura Limpia

### 1. **Independencia de Frameworks**
El núcleo de la aplicación no depende de ningún framework externo.

### 2. **Testabilidad**
Las capas están diseñadas para ser fácilmente testeables de forma aislada.

### 3. **Independencia de la UI**
La lógica de negocio funciona sin importar la interfaz de usuario.

### 4. **Independencia de la Base de Datos**
La lógica central no depende de ninguna base de datos específica.

### 5. **Independencia de cualquier agente externo**
El núcleo de negocio no conoce nada del mundo exterior.

## 🔄 Flujo de Desarrollo con Arquitectura Limpia

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

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
```

## 📱 Características de la Aplicación

### 🏠 Páginas Principales
- **Inicio**: Landing page con productos destacados
- **Explorar**: Catálogo de productos con filtros
- **Categorías**: Navegación por categorías
- **Chats**: Mensajería en tiempo real
- **Perfil**: Gestión de perfil de usuario
- **Mis Productos**: Gestión de productos del vendedor
- **Carrito**: Gestión de compras
- **Órdenes**: Historial de transacciones

### 🔧 Funcionalidades Técnicas
- **Autenticación JWT**: Sistema seguro de login
- **WebSockets**: Chat en tiempo real
- **Upload de Imágenes**: Carga múltiple de archivos
- **Geolocalización**: Búsqueda por proximidad
- **Filtros Avanzados**: Búsqueda y filtrado de productos
- **Responsive Design**: Optimizado para todos los dispositivos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/tunombre`)
3. Commit tus cambios (`git commit -m 'listo :V/'`)
4. Push a la rama (`git push origin feature/tunombre`)
5. Abre un Pull Request


## 📞 Contacto

- **Desarrollador**: SZ ARES
- **Email**: brusssilva904@gmail.com
- **Proyecto**: [GreenCycle](https://github.com/SZARES/green-cycle-connect-share)

---

**¡Únete a la revolución verde! 🌱♻️**
