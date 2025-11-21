"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_strategy_1 = require("../auth/jwt.strategy");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const listings_service_1 = require("./listings.service");
const listing_dto_1 = require("./listing.dto");
let ListingsController = class ListingsController {
    listingsService;
    constructor(listingsService) {
        this.listingsService = listingsService;
    }
    create(createListingDto) {
        return this.listingsService.create(createListingDto);
    }
    async findAll(search, query, featureIds, propertyType, minPrice, maxPrice, bedrooms, minBathrooms, minArea, maxArea, hasGarage, hasParking, hasAC, hasPool, sortBy, limit) {
        const parsedFeatureIds = featureIds
            ? featureIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
            : undefined;
        const parsedPropertyType = propertyType
            ? propertyType.split(',').map(type => type.trim())
            : undefined;
        return this.listingsService.findAll({
            search,
            query,
            featureIds: parsedFeatureIds,
            propertyType: parsedPropertyType,
            minPrice,
            maxPrice,
            bedrooms,
            minBathrooms,
            minArea,
            maxArea,
            hasGarage,
            hasParking,
            hasAC,
            hasPool,
            sortBy,
            limit,
        });
    }
    async findFeatured() {
        return this.listingsService.findFeatured();
    }
    findOne(id) {
        return this.listingsService.findOne(id);
    }
    update(id, updateListingDto) {
        return this.listingsService.update(id, updateListingDto);
    }
    async removeAll() {
        await this.listingsService.removeAll();
        return { message: 'All listings have been deleted successfully' };
    }
    remove(id) {
        return this.listingsService.remove(id);
    }
};
exports.ListingsController = ListingsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new listing' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listing_dto_1.CreateListingDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all listings with filtering, sorting and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search term for title, address, or description' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false, description: 'Alias for search parameter' }),
    (0, swagger_1.ApiQuery)({
        name: 'featureIds',
        required: false,
        description: 'Comma-separated list of feature IDs to filter by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'propertyType',
        required: false,
        description: 'Comma-separated list of property types to filter by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minPrice',
        required: false,
        description: 'Minimum price filter',
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'maxPrice',
        required: false,
        description: 'Maximum price filter',
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bedrooms',
        required: false,
        description: 'Minimum number of bedrooms',
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minBathrooms',
        required: false,
        description: 'Minimum number of bathrooms',
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minArea',
        required: false,
        description: 'Minimum area in square feet',
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'maxArea',
        required: false,
        description: 'Maximum area in square feet',
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'hasGarage',
        required: false,
        description: 'Filter by garage availability',
        type: Boolean,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'hasParking',
        required: false,
        description: 'Filter by parking availability',
        type: Boolean,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'hasAC',
        required: false,
        description: 'Filter by air conditioning',
        type: Boolean,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'hasPool',
        required: false,
        description: 'Filter by swimming pool',
        type: Boolean,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        enum: ['newest', 'price_asc', 'price_desc'],
        description: 'Sort order',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Limit number of results',
        type: Number,
    }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('query')),
    __param(2, (0, common_1.Query)('featureIds')),
    __param(3, (0, common_1.Query)('propertyType')),
    __param(4, (0, common_1.Query)('minPrice', new common_1.ParseIntPipe({ optional: true }))),
    __param(5, (0, common_1.Query)('maxPrice', new common_1.ParseIntPipe({ optional: true }))),
    __param(6, (0, common_1.Query)('bedrooms', new common_1.ParseIntPipe({ optional: true }))),
    __param(7, (0, common_1.Query)('minBathrooms', new common_1.ParseIntPipe({ optional: true }))),
    __param(8, (0, common_1.Query)('minArea', new common_1.ParseIntPipe({ optional: true }))),
    __param(9, (0, common_1.Query)('maxArea', new common_1.ParseIntPipe({ optional: true }))),
    __param(10, (0, common_1.Query)('hasGarage')),
    __param(11, (0, common_1.Query)('hasParking')),
    __param(12, (0, common_1.Query)('hasAC')),
    __param(13, (0, common_1.Query)('hasPool')),
    __param(14, (0, common_1.Query)('sortBy')),
    __param(15, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Number, Number, Number, Number, Number, String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured listings (top 8 listings with features)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the featured listings' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "findFeatured", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single listing by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a listing' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, listing_dto_1.UpdateListingDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete all listings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully deleted all listings' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin only' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "removeAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a listing' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "remove", null);
exports.ListingsController = ListingsController = __decorate([
    (0, swagger_1.ApiTags)('listings'),
    (0, common_1.Controller)('listings'),
    (0, common_1.UseGuards)(jwt_strategy_1.JwtStrategy, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)('admin'),
    __metadata("design:paramtypes", [listings_service_1.ListingsService])
], ListingsController);
//# sourceMappingURL=listings.controller.js.map