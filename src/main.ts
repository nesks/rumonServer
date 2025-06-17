import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ErrorLoggingInterceptor } from './common/interceptors/error-logging.interceptor';
import { DiscordLoggerService } from './common/services/discord-logger.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  // Configuração global do ValidationPipe para aplicar transformações
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Aplica @Transform automaticamente
    whitelist: true, // Remove campos não definidos no DTO
    forbidNonWhitelisted: true, // Gera erro para campos extras
    transformOptions: {
      enableImplicitConversion: true, // Conversão automática de tipos
    },
  }));

  // Filtro global de exceções
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor global para logging de erros 500 (incluindo envio para Discord)
  const discordLogger = app.get(DiscordLoggerService);
  app.useGlobalInterceptors(new ErrorLoggingInterceptor(discordLogger));

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

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`🚀 Servidor rodando na porta ${port}`);
  logger.log(`📚 Documentação disponível em http://localhost:${port}/api`);
}
bootstrap();
