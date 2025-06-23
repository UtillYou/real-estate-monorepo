import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixFeatureIdSequence1750590000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create a sequence for the features table
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS features_id_seq
        INCREMENT 1
        START 1
        MINVALUE 1
        NO MAXVALUE
        CACHE 1;
      
      -- Set the default value of the id column to use the sequence
      ALTER TABLE features 
        ALTER COLUMN id 
        SET DEFAULT nextval('features_id_seq');
      
      // Set the sequence to the maximum id + 1 to avoid conflicts
      SELECT setval('features_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM features), false);
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
