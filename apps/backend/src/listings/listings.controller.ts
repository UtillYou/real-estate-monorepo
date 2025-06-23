import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseArrayPipe, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto } from './listing.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new listing' })
  create(@Body() createListingDto: CreateListingDto) {
    return this.listingsService.create(createListingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all listings with optional search' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'featureIds',
    required: false,
    description: 'Comma-separated list of feature IDs to filter by',
  })
  async findAll(
    @Query('search') search?: string,
    @Query('featureIds') featureIds?: string,
  ) {
    const parsedFeatureIds = featureIds
      ? featureIds.split(',').map(id => parseInt(id.trim(), 10))
      : undefined;
    
    return this.listingsService.findAll(search, parsedFeatureIds);
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a listing' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.listingsService.remove(id);
  }
}
