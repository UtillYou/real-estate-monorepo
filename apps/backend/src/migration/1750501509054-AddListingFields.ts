import { MigrationInterface, QueryRunner } from "typeorm";

export class AddListingFields1750501509054 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns
        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD COLUMN "property_type" character varying NOT NULL DEFAULT 'APARTMENT';
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD COLUMN "city" character varying NOT NULL DEFAULT '';
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD COLUMN "state" character varying;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD COLUMN "zip_code" character varying;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD COLUMN "bedrooms" integer NOT NULL DEFAULT 0;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD COLUMN "bathrooms" numeric(3,1) NOT NULL DEFAULT 0;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD COLUMN "square_feet" integer NOT NULL DEFAULT 0;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD COLUMN "year_built" integer;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD COLUMN "features" text[] NOT NULL DEFAULT '{}';
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD COLUMN "image_urls" text[] NOT NULL DEFAULT '{}';
        `);
            
        // Handle existing imageUrl data
        await queryRunner.query(`
            UPDATE "listings" 
            SET "image_urls" = ARRAY["imageUrl"] 
            WHERE "imageUrl" IS NOT NULL AND "imageUrl" != ''
        `);
        
        // Rename the old column to mark it for removal
        await queryRunner.query(`
            ALTER TABLE "listings" 
            RENAME COLUMN "imageUrl" TO "image_url_old";
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Restore the old imageUrl column
        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD COLUMN "imageUrl" character varying;
        `);
            
        // Copy data back from the first element of image_urls array
        await queryRunner.query(`
            UPDATE "listings" 
            SET "imageUrl" = "image_urls"[1] 
            WHERE array_length("image_urls", 1) > 0;
        `);
            
        // Drop all the new columns
        await queryRunner.query(`
            ALTER TABLE "listings"
            DROP COLUMN "property_type";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings"
            DROP COLUMN "city";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings"
            DROP COLUMN "state";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings"
            DROP COLUMN "zip_code";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings"
            DROP COLUMN "bedrooms";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings"
            DROP COLUMN "bathrooms";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings"
            DROP COLUMN "square_feet";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings"
            DROP COLUMN "year_built";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings"
            DROP COLUMN "features";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "listings"
            DROP COLUMN "image_urls";
        `);
        
        // Drop the temporary column
        await queryRunner.query(`
            ALTER TABLE "listings"
            DROP COLUMN IF EXISTS "image_url_old";
        `);
    }
}
