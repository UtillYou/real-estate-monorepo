import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class RefreshTokenMigration1750513968805 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'refresh_tokens',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'expiresAt',
                        type: 'timestamp',
                    },
                    {
                        name: 'isRevoked',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'userId',
                        type: 'int',
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

        await queryRunner.createForeignKey(
            'refresh_tokens',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('refresh_tokens');
        if (table) {
            const foreignKey = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf('userId') !== -1,
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey('refresh_tokens', foreignKey);
            }
        }
        await queryRunner.dropTable('refresh_tokens');
    }
}
