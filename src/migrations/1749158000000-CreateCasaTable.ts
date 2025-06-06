import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCasaTable1749158000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'casas',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'cidade',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'estado',
                    type: 'varchar',
                    length: '2',
                    isNullable: false
                },
                {
                    name: 'endereco',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'valorAluguel',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true
                },
                {
                    name: 'valorTotal',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true
                },
                {
                    name: 'quantidadeVagas',
                    type: 'int',
                    isNullable: false
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP'
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('casas');
    }
} 