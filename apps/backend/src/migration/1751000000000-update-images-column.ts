import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateImagesColumn1751000000000 implements MigrationInterface {
    name = 'UpdateImagesColumn1751000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, create a new column for the JSON data
        await queryRunner.query(`ALTER TABLE "listings" ADD COLUMN "images_temp" jsonb NOT NULL DEFAULT '[]'`);
        
        // Migrate data from the old column to the new one
        await queryRunner.query(`
            UPDATE "listings" 
            SET "images_temp" = 
                CASE 
                    WHEN "imageUrls" IS NOT NULL AND array_length("imageUrls", 1) > 0 
                    THEN jsonb_build_array(jsonb_build_object('url', "imageUrls"[1], 'name', 'image'))
                    ELSE '[]'::jsonb 
                END
        `);
        
        // Drop the old column
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "imageUrls"`);
        
        // Rename the new column
        await queryRunner.query(`ALTER TABLE "listings" RENAME COLUMN "images_temp" TO "images"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Create the old column
        await queryRunner.query(`ALTER TABLE "listings" ADD COLUMN "imageUrls" text[] NOT NULL DEFAULT '{}'`);
        
        // Migrate data back to the old format
        await queryRunner.query(`
            UPDATE "listings" 
            SET "imageUrls" = 
                CASE 
                    WHEN jsonb_array_length("images") > 0 
                    THEN ARRAY["images"->0->>'url'] 
                    ELSE '{}'::text[] 
                END
        `);
        
        // Drop the new column
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "images"`);
    }
}
