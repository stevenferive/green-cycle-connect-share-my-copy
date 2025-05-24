// Configuración de la aplicación en la capa de infraestructura
export interface AppConfig {
  apiUrl: string;
  enableDebug: boolean;
  appVersion: string;
}

// Valores por defecto para la configuración
const defaultConfig: AppConfig = {
  apiUrl: 'https://api.example.com',
  enableDebug: false,
  appVersion: '1.0.0',
};

// Cargar configuración desde variables de entorno
export const loadConfig = (): AppConfig => {
  return {
    apiUrl: import.meta.env.VITE_API_URL || defaultConfig.apiUrl,
    enableDebug: import.meta.env.VITE_DEBUG === 'true' || defaultConfig.enableDebug,
    appVersion: import.meta.env.VITE_APP_VERSION || defaultConfig.appVersion,
  };
};

// Exportar una instancia de la configuración
export const appConfig = loadConfig(); 