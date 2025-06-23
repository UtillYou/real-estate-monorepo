import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateFeaturesAndListingFeatures1750592162512 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create features table
        await queryRunner.createTable(
            new Table({
                name: 'feature',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'icon',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Create listing_features join table
        await queryRunner.createTable(
            new Table({
                name: 'listing_features',
                columns: [
                    {
                        name: 'listing_id',
                        type: 'int',
                        isPrimary: true,
                    },
                    {
                        name: 'feature_id',
                        type: 'int',
                        isPrimary: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Add foreign keys
        await queryRunner.createForeignKey(
            'listing_features',
            new TableForeignKey({
                columnNames: ['listing_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'listing',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'listing_features',
            new TableForeignKey({
                columnNames: ['feature_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'feature',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        const listingFeaturesTable = await queryRunner.getTable('listing_features');
        if (listingFeaturesTable) {
            const listingFk = listingFeaturesTable.foreignKeys.find(
                fk => fk.columnNames.indexOf('listing_id') !== -1,
            );
            const featureFk = listingFeaturesTable.foreignKeys.find(
                fk => fk.columnNames.indexOf('feature_id') !== -1,
            );

            if (listingFk) {
                await queryRunner.dropForeignKey('listing_features', listingFk);
            }
            if (featureFk) {
                await queryRunner.dropForeignKey('listing_features', featureFk);
            }
        }

        // Drop tables
        await queryRunner.dropTable('listing_features');
        await queryRunner.dropTable('feature');
    }
}
