import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixFeatureIdAutoIncrement1750590000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, drop the existing primary key constraint
    await queryRunner.query(`
      ALTER TABLE features DROP CONSTRAINT IF EXISTS features_pkey CASCADE;
    `);

    // Create a sequence for the features table
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS features_id_seq;
      SELECT setval('features_id_seq', COALESCE((SELECT MAX(id) FROM features), 0) + 1);
    `);

    // Alter the id column to use the sequence as default
    await queryRunner.query(`
      ALTER TABLE features 
        ALTER COLUMN id 
        SET DEFAULT nextval('features_id_seq');
      
      -- Re-add the primary key constraint
      ALTER TABLE features 
        ADD CONSTRAINT features_pkey 
        PRIMARY KEY (id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the default value and drop the sequence when rolling back
    await queryRunner.query(`
      ALTER TABLE features 
        ALTER COLUMN id 
        DROP DEFAULT;
      
      DROP SEQUENCE IF EXISTS features_id_seq;
    `);
  }
}
