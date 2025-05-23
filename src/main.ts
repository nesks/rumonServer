import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:8081', 
      'https://vercel.app',
      'https://*.vercel.app',
      /https:\/\/.*\.vercel\.app$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'authorization'
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Rumon API')
    .setDescription('API do sistema Rumon para gerenciamento de repúblicas estudantis')
    .setVersion('1.0')
    .addTag('users', 'Endpoints para gerenciamento de usuários')
    .addTag('auth', 'Endpoints para autenticação')
    .addTag('republics', 'Endpoints para gerenciamento de repúblicas')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      }
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
