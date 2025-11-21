import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadsModule } from './uploads';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Listing } from './listings/listing.entity';
import { RefreshToken } from './auth/refresh-token.entity';
import { ListingsModule } from './listings/listings.module';
import { UsersModule } from './users/users.module';
import { Feature } from './features/feature.entity';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the config available throughout your app
      envFilePath: '.env', // path to your .env file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PGHOST'),
        port: configService.get<number>('PGPORT', 5432),
        username: configService.get<string>('PGUSER'),
        password: configService.get<string>('PGPASSWORD'),
        database: configService.get<string>('PGDATABASE'),
        entities: [User, Listing, RefreshToken, Feature],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        ssl: false,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
    AuthModule,
    ListingsModule,
    UploadsModule,
    UsersModule,
    FeaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
