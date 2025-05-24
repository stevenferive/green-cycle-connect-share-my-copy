// Interfaces para tipado
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface UserCredentials {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

// Clave utilizada para almacenar los usuarios en localStorage
const USERS_STORAGE_KEY = 'greencycle_users';
const CURRENT_USER_KEY = 'greencycle_current_user';

// Función auxiliar para generar IDs únicos
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Función para obtener todos los usuarios
export const getUsers = (): Record<string, User & { password: string }> => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : {};
};

// Función para registrar un nuevo usuario
export const register = (credentials: UserCredentials): { success: boolean; message?: string; user?: User } => {
  if (!credentials.firstName || !credentials.lastName || !credentials.email || !credentials.password) {
    return { success: false, message: 'Todos los campos son obligatorios' };
  }

  // Obtener usuarios existentes
  const users = getUsers();

  // Verificar si el correo ya está registrado
  const userEmails = Object.values(users).map(user => user.email);
  if (userEmails.includes(credentials.email)) {
    return { success: false, message: 'Este correo electrónico ya está registrado' };
  }

  // Crear nuevo usuario
  const userId = generateId();
  const newUser: User & { password: string } = {
    id: userId,
    firstName: credentials.firstName,
    lastName: credentials.lastName,
    email: credentials.email,
    password: credentials.password, // En una aplicación real, se debería hashear la contraseña
    createdAt: new Date().toISOString()
  };

  // Guardar usuario
  users[userId] = newUser;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  // Devolver usuario sin la contraseña
  const { password, ...userWithoutPassword } = newUser;
  return { success: true, user: userWithoutPassword };
};

// Función para iniciar sesión
export const login = (credentials: { email: string; password: string }): { success: boolean; message?: string; user?: User } => {
  const users = getUsers();
  
  // Buscar usuario por correo electrónico
  const user = Object.values(users).find(user => user.email === credentials.email);
  
  if (!user) {
    return { success: false, message: 'Correo electrónico no encontrado' };
  }
  
  if (user.password !== credentials.password) {
    return { success: false, message: 'Contraseña incorrecta' };
  }
  
  // Guardar sesión actual
  const { password, ...userWithoutPassword } = user;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  
  return { success: true, user: userWithoutPassword };
};

// Función para verificar si hay una sesión activa
export const getCurrentUser = (): User | null => {
  const currentUserJson = localStorage.getItem(CURRENT_USER_KEY);
  return currentUserJson ? JSON.parse(currentUserJson) : null;
};

// Función para cerrar sesión
export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
}; 