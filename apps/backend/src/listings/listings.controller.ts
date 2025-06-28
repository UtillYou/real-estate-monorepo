import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/roles.decorator';
import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto } from './listing.dto';

@ApiTags('listings')
@Controller('listings')
@UseGuards(JwtStrategy, RolesGuard)
@Role('admin')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new listing' })
  create(@Body() createListingDto: CreateListingDto) {
    return this.listingsService.create(createListingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all listings with optional search, sorting and pagination' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'featureIds',
    required: false,
    description: 'Comma-separated list of feature IDs to filter by',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['newest', 'price_asc', 'price_desc'],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of results',
    type: Number,
  })
  async findAll(
    @Query('search') search?: string,
    @Query('featureIds') featureIds?: string,
    @Query('sortBy') sortBy?: 'newest' | 'price_asc' | 'price_desc',
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const parsedFeatureIds = featureIds
      ? featureIds.split(',').map(id => parseInt(id.trim(), 10))
      : undefined;
    
    return this.listingsService.findAll({
      search,
      featureIds: parsedFeatureIds,
      sortBy,
      limit,
    });
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured listings (top 8 listings with features)' })
  @ApiResponse({ status: 200, description: 'Returns the featured listings' })
  async findFeatured() {
    return this.listingsService.findFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single listing by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.listingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a listing' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, updateListingDto);
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete all listings' })
  @ApiResponse({ status: 200, description: 'Successfully deleted all listings' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async removeAll() {
    await this.listingsService.removeAll();
    return { message: 'All listings have been deleted successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a listing' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.listingsService.remove(id);
  }
}
