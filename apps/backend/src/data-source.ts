import { DataSource } from 'typeorm';
// import { Listing } from './listings/listing.entity';

// Use Railway's DATABASE_URL if available, otherwise fallback to individual variables
const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  port: Number(process.env.DB_PORT || process.env.PGPORT || '5432'),
  username: process.env.DB_USER || process.env.PGUSER || 'postgres',
  password: process.env.DB_PASS || process.env.PGPASSWORD || 'postgres',
  database: process.env.DB_NAME || process.env.PGDATABASE || 'realestate',
  // entities: [Listing],
  migrations: [__dirname + '/migration/*.{ts,js}'],
  synchronize: false,
  ssl: databaseUrl ? { rejectUnauthorized: false } : false,
});
