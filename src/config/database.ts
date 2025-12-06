import { DataSource } from 'typeorm';
import { env } from './env';
import { Logger } from '../utils/logger';

// Determine if we're in production (using compiled JS files)
const isProduction = env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  // Only use synchronize in development - in production we use migrations
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
  // Use compiled JS files in production, TS files in development
  entities: isProduction 
    ? ['dist/entities/**/*.js'] 
    : ['src/entities/**/*.ts'],
  migrations: isProduction 
    ? ['dist/migrations/**/*.js'] 
    : ['src/migrations/**/*.ts'],
  subscribers: isProduction 
    ? ['dist/subscribers/**/*.js'] 
    : ['src/subscribers/**/*.ts'],
  // Enable SSL for production databases (required by most cloud providers)
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    Logger.info('Database connected successfully');
    
    // Run pending migrations in production
    if (isProduction) {
      Logger.info('Running pending migrations...');
      const pendingMigrations = await AppDataSource.showMigrations();
      
      if (pendingMigrations) {
        await AppDataSource.runMigrations();
        Logger.info('Migrations completed successfully');
      } else {
        Logger.info('No pending migrations');
      }
    }
  } catch (error) {
    Logger.error('Database connection failed');
    Logger.error(error);
    process.exit(1);
  }
};
