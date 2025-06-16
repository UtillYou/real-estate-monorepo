import { DataSource } from 'typeorm';
// import { Listing } from './listings/listing.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'realestate',
  // entities: [Listing],
  migrations: [__dirname + '/migration/*.{ts,js}'],
  synchronize: false,
});
