// Modelo de datos en la capa de datos
// Esta interfaz representa los datos como vienen de la fuente externa (API, DB)
export interface UserModel {
  id: string;
  name: string;
  email: string;
  created_at: string; // Nótese que aquí es string (formato ISO) y no Date
  avatar_url?: string; // Campo adicional que no está en la entidad de dominio
} 