import { HealthModule } from './health/health.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminController } from './admin/admin.controller';
import { TestModule } from './test/test.module';
import { EventsModule } from './modules/events/events.module';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // .env به صورت گلوبال
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB با دریافت URI از ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: Number(config.get('THROTTLE_TTL')) || 60,   // ثانیه
            limit: Number(config.get('THROTTLE_LIMIT')) || 100,
          },
        ],
      }),
    }),

    // سایر ماژول‌ها
    AuthModule,
    UsersModule,
    TestModule,
    EventsModule,
    HealthModule,
  ],
  controllers: [AppController, AdminController],
  providers: [
    AppService,
    // فعال‌سازی گارد Rate-Limit به صورت سراسری
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

