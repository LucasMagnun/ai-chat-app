import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001', // URL do seu front
    credentials: true, // se for usar cookies/sessão
  });

  await app.listen(3000);
}
bootstrap();
