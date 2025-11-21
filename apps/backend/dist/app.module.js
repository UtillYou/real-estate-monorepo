"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const uploads_1 = require("./uploads");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./users/user.entity");
const listing_entity_1 = require("./listings/listing.entity");
const refresh_token_entity_1 = require("./auth/refresh-token.entity");
const listings_module_1 = require("./listings/listings.module");
const users_module_1 = require("./users/users.module");
const feature_entity_1 = require("./features/feature.entity");
const features_module_1 = require("./features/features.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.PGHOST || 'localhost',
                port: parseInt(process.env.PGPORT || '5432', 10),
                username: process.env.PGUSER || 'postgres',
                password: process.env.PGPASSWORD || 'postgres',
                database: process.env.PGDATABASE || 'realestate',
                entities: [user_entity_1.User, listing_entity_1.Listing, refresh_token_entity_1.RefreshToken, feature_entity_1.Feature],
                synchronize: true,
                ssl: false,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, refresh_token_entity_1.RefreshToken]),
            auth_module_1.AuthModule,
            listings_module_1.ListingsModule,
            uploads_1.UploadsModule,
            users_module_1.UsersModule,
            features_module_1.FeaturesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map