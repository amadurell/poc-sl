import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow different API versions to co-exist
  app
    .enableVersioning({
      type: VersioningType.URI,
      prefix: false,
    })
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

  const docConfig = new DocumentBuilder()
    .setTitle('esercizio')
    .setDescription('The Customers/Projects/Documents Manager API description')
    .setVersion('1.0')
    .addTag('esercizio')
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
