import { MigrationInterface, QueryRunner } from "typeorm";

export class TruncateListings1750505000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`TRUNCATE TABLE "listings" CASCADE`);
    }

    public async down(): Promise<void> {
        // This migration cannot be rolled back as data is deleted
    }
}
