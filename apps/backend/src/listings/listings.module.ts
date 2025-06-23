import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './listing.entity';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { FeaturesModule } from '../features/features.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing]),
    FeaturesModule,
  ],
  providers: [ListingsService],
  controllers: [ListingsController],
})
export class ListingsModule {}
