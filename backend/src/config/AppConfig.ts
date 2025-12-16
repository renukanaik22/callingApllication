export interface AppConfig {
  port: number;
  corsOrigin: string;
  nodeEnv: string;
}

export const getAppConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  nodeEnv: process.env.NODE_ENV || 'development'
});