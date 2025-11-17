import { Module } from '@nestjs/common';
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

console.log('wss env:', process.env);

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      username: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'realestate',
      entities: [User, Listing, RefreshToken, Feature],
      synchronize: false, // set false in production
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
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
