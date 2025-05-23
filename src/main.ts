import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
