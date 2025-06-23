import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixFeaturesTable1750590000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, drop the foreign key constraint from listing_features
    await queryRunner.query(`
      ALTER TABLE "listing_features" 
      DROP CONSTRAINT IF EXISTS "FK_c90e70108e41727d1d3bc008e71";
    `);

    // Drop the primary key constraint
    await queryRunner.query(`
      ALTER TABLE "features" 
      DROP CONSTRAINT IF EXISTS "pk_fe83372d2c5f2e2d7f4a9f5f5e5";
    `);

    // Create a sequence for the features table
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS features_id_seq;
      SELECT setval('features_id_seq', COALESCE((SELECT MAX(id) FROM features), 0) + 1);
    `);

    // Alter the id column to use the sequence as default
    await queryRunner.query(`
      ALTER TABLE "features" 
      ALTER COLUMN "id" 
      SET DEFAULT nextval('features_id_seq');
      
      -- Re-add the primary key constraint
      ALTER TABLE "features" 
      ADD CONSTRAINT "features_pkey" 
      PRIMARY KEY ("id");
    `);

    // Re-add the foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "listing_features" 
      ADD CONSTRAINT "FK_c90e70108e41727d1d3bc008e71" 
      FOREIGN KEY ("feature_id") 
      REFERENCES "features"("id") 
      ON DELETE CASCADE 
      ON UPDATE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "listing_features" 
      DROP CONSTRAINT IF EXISTS "FK_c90e70108e41727d1d3bc008e71";
    `);

    // Remove the default value and drop the sequence
    await queryRunner.query(`
      ALTER TABLE "features" 
      ALTER COLUMN "id" 
      DROP DEFAULT;
      
      DROP SEQUENCE IF EXISTS features_id_seq;
    `);
  }
}
