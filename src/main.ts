import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ✅ Enable WebSockets explicitly
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Body parser
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('NestJS API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ?? 3000;
  const host = '0.0.0.0'; // ✅ force IPv4 for Docker & cloud

  await app.listen(port, host);

  const url = `http://localhost:${port}`;
  console.log(`🚀 Application is running on: ${url}`);
  console.log(`📚 Swagger docs available at: ${url}/api-docs`);
}
bootstrap();
