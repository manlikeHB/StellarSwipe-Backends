import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";
import { stellarConfig } from "./config/stellar.config";
import { databaseConfig, redisConfig } from "./config/database.config";
import { xaiConfig } from "./config/xai.config";
import { appConfig } from "./config/app.config";
import { StellarConfigService } from "./config/stellar.service";
import { SignalsModule } from "./signals/signals.module";
import { AiValidationModule } from "./ai-validation/ai-validation.module";

@Module({
  imports: [
    // Configuration Module - loads environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, stellarConfig, databaseConfig, redisConfig, xaiConfig],
      envFilePath: ".env",
      cache: true,
    }),
    // Bull Module for async processing
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get("redis.host"),
          port: configService.get("redis.port"),
          password: configService.get("redis.password"),
          db: configService.get("redis.db"),
        },
      }),
    }),
    // Database Module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres" as const,
        host: configService.get("database.host"),
        port: configService.get("database.port"),
        username: configService.get("database.username"),
        password: configService.get("database.password"),
        database: configService.get<string>("database.database"),
        synchronize: configService.get("database.synchronize"),
        logging: configService.get("database.logging"),
        entities: ["dist/**/*.entity{.ts,.js}"],
        migrations: ["dist/migrations/*{.ts,.js}"],
        subscribers: ["dist/subscribers/*{.ts,.js}"],
        ssl: configService.get("database.ssl") as any,
      }),
    }),
    SignalsModule,
    AiValidationModule,
  ],
  providers: [StellarConfigService],
  exports: [StellarConfigService],
})
export class AppModule {}
