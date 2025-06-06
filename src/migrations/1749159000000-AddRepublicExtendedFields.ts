import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddRepublicExtendedFields1749159000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar enum types
        await queryRunner.query(`
            CREATE TYPE "republic_tipo_enum" AS ENUM('masculina', 'feminina', 'mista')
        `);
        
        await queryRunner.query(`
            CREATE TYPE "republic_status_enum" AS ENUM('ativa', 'inativa', 'reformando', 'suspended')
        `);

        // Adicionar novas colunas
        await queryRunner.addColumns('republics', [
            new TableColumn({
                name: 'tipo',
                type: 'enum',
                enum: ['masculina', 'feminina', 'mista'],
                isNullable: true
            }),
            new TableColumn({
                name: 'fundada_em',
                type: 'date',
                isNullable: true
            }),
            new TableColumn({
                name: 'status',
                type: 'enum',
                enum: ['ativa', 'inativa', 'reformando', 'suspended'],
                isNullable: true
            }),
            new TableColumn({
                name: 'foto_capa',
                type: 'varchar',
                isNullable: true
            }),
            new TableColumn({
                name: 'instagram',
                type: 'varchar',
                isNullable: true
            }),
            new TableColumn({
                name: 'hino',
                type: 'text',
                isNullable: true
            }),
            new TableColumn({
                name: 'linkEstatutoPdf',
                type: 'varchar',
                isNullable: true
            }),
            new TableColumn({
                name: 'usuario_rumon_id',
                type: 'varchar',
                isNullable: true
            }),
            new TableColumn({
                name: 'casa_id',
                type: 'varchar',
                isNullable: true
            })
        ]);

        // Adicionar foreign keys
        await queryRunner.createForeignKey('republics', new TableForeignKey({
            columnNames: ['usuario_rumon_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL'
        }));

        await queryRunner.createForeignKey('republics', new TableForeignKey({
            columnNames: ['casa_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'casas',
            onDelete: 'SET NULL'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover foreign keys
        const table = await queryRunner.getTable('republics');
        if (table) {
            const usuarioRumonForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('usuario_rumon_id') !== -1);
            const casaForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('casa_id') !== -1);
        
            if (usuarioRumonForeignKey) {
                await queryRunner.dropForeignKey('republics', usuarioRumonForeignKey);
            }
            
            if (casaForeignKey) {
                await queryRunner.dropForeignKey('republics', casaForeignKey);
            }
        }

        // Remover colunas
        await queryRunner.dropColumns('republics', [
            'tipo', 'fundada_em', 'status', 'foto_capa', 'instagram', 
            'hino', 'linkEstatutoPdf', 'usuario_rumon_id', 'casa_id'
        ]);

        // Remover enum types
        await queryRunner.query(`DROP TYPE "republic_tipo_enum"`);
        await queryRunner.query(`DROP TYPE "republic_status_enum"`);
    }
} 