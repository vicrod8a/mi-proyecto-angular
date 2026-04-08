import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // ignora campos que no están en el DTO
    forbidNonWhitelisted: false,
    transform: true,       // transforma los tipos automáticamente
    errorHttpStatusCode: 400,
  }));
  app.enableCors();
  await app.listen(3001);
  console.log('User Service corriendo en http://localhost:3001');
}
bootstrap();


