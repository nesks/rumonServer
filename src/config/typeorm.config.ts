import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Republic } from '../republics/entities/republic.entity';
import { Casa } from '../republics/entities/casa.entity';
import { UserSocialMedia } from '../users/entities/user-social-media.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'rumon',
  entities: [User, Republic, Casa, UserSocialMedia],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
}); 