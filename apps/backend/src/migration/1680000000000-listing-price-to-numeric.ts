import { MigrationInterface, QueryRunner } from "typeorm";

export class listingPriceToNumeric1680000000000 implements MigrationInterface {
    name = 'listingPriceToNumeric1680000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "price" TYPE numeric USING price::numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "price" TYPE text USING price::text`);
    }
}
