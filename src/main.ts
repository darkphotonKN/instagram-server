import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // load environment variables from .env file
  // dotenv.config();

  const app = await NestFactory.create(AppModule);

  // sets the global base route to prefix all apis routes
  app.setGlobalPrefix('/api');

  app.enableCors({
    origin: 'http://localhost:3041', // Replace with your frontend app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable sending cookies and other credentials
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false, // Set to true in production
    }),
  );

  await app.listen(8080);
}
bootstrap();
