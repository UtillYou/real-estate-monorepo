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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
const typeorm_1 = require("typeorm");
const listing_entity_1 = require("../listings/listing.entity");
let Feature = class Feature {
    id;
    name;
    icon;
    listings;
    createdAt;
    updatedAt;
};
exports.Feature = Feature;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Feature.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Feature.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Feature.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => listing_entity_1.Listing, listing => listing.features),
    (0, typeorm_1.JoinTable)({
        name: 'listing_features',
        joinColumn: { name: 'feature_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'listing_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Feature.prototype, "listings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Feature.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Feature.prototype, "updatedAt", void 0);
exports.Feature = Feature = __decorate([
    (0, typeorm_1.Entity)('features')
], Feature);
//# sourceMappingURL=feature.entity.js.map