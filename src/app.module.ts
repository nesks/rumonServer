import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RepublicsModule } from './republics/republics.module';
import { User } from './users/entities/user.entity';
import { Republic } from './republics/entities/republic.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'rumon'),
        password: configService.get('DB_PASSWORD', 'rumon'),
        database: configService.get('DB_DATABASE', 'rumon'),
        entities: [User, Republic],
        synchronize: configService.get('NODE_ENV') !== 'production',
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    RepublicsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
