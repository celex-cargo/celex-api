import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';         // مهم: CommonJS
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';       // مهم: CommonJS

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Prefix
  app.setGlobalPrefix('api');

  // Security & body parsing
  app.use(helmet());
  app.use(cookieParser());

  // CORS
  const originsEnv = config.get<string>('CORS_ORIGINS') || '';
  const allowed = originsEnv
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // برای curl/health
      if (allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
      cb(new Error('CORS blocked'), false);
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });

  // برای Throttler پشت Nginx: trust proxy روی اینستنس Express
  const trustProxy = Number(config.get<string>('TRUST_PROXY') ?? '1');
  const expressApp = app.getHttpAdapter().getInstance();
  if (trustProxy > 0 && expressApp?.set) {
    expressApp.set('trust proxy', trustProxy);
  }

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger + Basic Auth
  const swaggerEnabled =
    (config.get<string>('SWAGGER_ENABLED') || '').toLowerCase() === 'true';

  if (swaggerEnabled) {
    const swaggerUser = config.get<string>('SWAGGER_USER') || 'celex';
    const swaggerPass = config.get<string>('SWAGGER_PASS') || 'change-me';

    // محافظت از /api/docs و /api/docs-json
    app.use(
      ['/api/docs', '/api/docs-json'],
      basicAuth({
        challenge: true,
        users: { [swaggerUser]: swaggerPass },
      }),
    );

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Celex API')
      .setDescription('API documentation for Celex')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = Number(config.get<string>('PORT') || '5000');
  await app.listen(port, '127.0.0.1');
  console.log(`Celex API is listening on http://127.0.0.1:${port}`);
}

bootstrap();
