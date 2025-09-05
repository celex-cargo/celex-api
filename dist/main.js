"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const cookieParser = require("cookie-parser");
const swagger_1 = require("@nestjs/swagger");
const basicAuth = require("express-basic-auth");
async function bootstrap() {
    var _a;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api');
    app.use((0, helmet_1.default)());
    app.use(cookieParser());
    const originsEnv = config.get('CORS_ORIGINS') || '';
    const allowed = originsEnv
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    app.enableCors({
        origin: (origin, cb) => {
            if (!origin)
                return cb(null, true);
            if (allowed.length === 0 || allowed.includes(origin))
                return cb(null, true);
            cb(new Error('CORS blocked'), false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const trustProxy = Number((_a = config.get('TRUST_PROXY')) !== null && _a !== void 0 ? _a : '1');
    const expressApp = app.getHttpAdapter().getInstance();
    if (trustProxy > 0 && (expressApp === null || expressApp === void 0 ? void 0 : expressApp.set)) {
        expressApp.set('trust proxy', trustProxy);
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidUnknownValues: false,
        transformOptions: { enableImplicitConversion: true },
    }));
    const swaggerEnabled = (config.get('SWAGGER_ENABLED') || '').toLowerCase() === 'true';
    if (swaggerEnabled) {
        const swaggerUser = config.get('SWAGGER_USER') || 'celex';
        const swaggerPass = config.get('SWAGGER_PASS') || 'change-me';
        app.use(['/api/docs', '/api/docs-json'], basicAuth({
            challenge: true,
            users: { [swaggerUser]: swaggerPass },
        }));
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('Celex API')
            .setDescription('API documentation for Celex')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    const port = Number(config.get('PORT') || '5000');
    await app.listen(port, '127.0.0.1');
    console.log(`Celex API is listening on http://127.0.0.1:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map