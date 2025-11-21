"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const databaseUrl = process.env.DATABASE_URL;
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: databaseUrl,
    migrations: [__dirname + '/migration/*.{ts,js}'],
    synchronize: false,
    ssl: databaseUrl ? { rejectUnauthorized: false } : false,
});
//# sourceMappingURL=data-source.js.map