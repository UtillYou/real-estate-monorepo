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

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432', 10),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      entities: [User, Listing, RefreshToken, Feature],
      synchronize: true, // set false in production
      ssl: false,
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
