import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateEventsModule1734548000000 implements MigrationInterface {
  name = 'CreateEventsModule1734548000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar ENUM types
    await queryRunner.query(`CREATE TYPE "event_status_enum" AS ENUM('pendente', 'aprovado', 'rejeitado')`);
    await queryRunner.query(`CREATE TYPE "event_visibility_enum" AS ENUM('aberto', 'fechado')`);
    await queryRunner.query(`CREATE TYPE "invite_status_enum" AS ENUM('pendente', 'interessado', 'confirmado', 'recusado')`);

    // Criar tabela event_types
    await queryRunner.createTable(
      new Table({
        name: 'event_types',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'color',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'onePerDay',
            type: 'boolean',
            default: false,
          },
          {
            name: 'monthsInAdvance',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'requiresApproval',
            type: 'boolean',
            default: false,
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
          },
        ],
      }),
      true,
    );

    // Criar tabela events
    await queryRunner.createTable(
      new Table({
        name: 'events',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'eventDate',
            type: 'date',
          },
          {
            name: 'eventTime',
            type: 'time',
          },
          {
            name: 'location',
            type: 'varchar',
          },
          {
            name: 'mediaUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'visibility',
            type: 'enum',
            enum: ['aberto', 'fechado'],
            default: "'aberto'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pendente', 'aprovado', 'rejeitado'],
            default: "'pendente'",
          },
          {
            name: 'rejectionReason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by_id',
            type: 'uuid',
          },
          {
            name: 'event_type_id',
            type: 'uuid',
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
          },
        ],
      }),
      true,
    );

    // Criar tabela event_republics
    await queryRunner.createTable(
      new Table({
        name: 'event_republics',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'event_id',
            type: 'uuid',
          },
          {
            name: 'republic_id',
            type: 'uuid',
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

    // Criar tabela event_invites
    await queryRunner.createTable(
      new Table({
        name: 'event_invites',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'event_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pendente', 'interessado', 'confirmado', 'recusado'],
            default: "'pendente'",
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
          },
        ],
      }),
      true,
    );

    // Criar foreign keys
    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['event_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'event_types',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'event_republics',
      new TableForeignKey({
        columnNames: ['event_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'events',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'event_republics',
      new TableForeignKey({
        columnNames: ['republic_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'republics',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'event_invites',
      new TableForeignKey({
        columnNames: ['event_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'events',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'event_invites',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Criar índices
    await queryRunner.createIndex('events', new TableIndex({ name: 'IDX_EVENT_DATE', columnNames: ['eventDate'] }));
    await queryRunner.createIndex('events', new TableIndex({ name: 'IDX_EVENT_STATUS', columnNames: ['status'] }));
    await queryRunner.createIndex('events', new TableIndex({ name: 'IDX_EVENT_VISIBILITY', columnNames: ['visibility'] }));
    await queryRunner.createIndex('event_republics', new TableIndex({ name: 'IDX_EVENT_REPUBLIC_UNIQUE', columnNames: ['event_id', 'republic_id'], isUnique: true }));
    await queryRunner.createIndex('event_invites', new TableIndex({ name: 'IDX_EVENT_INVITE_UNIQUE', columnNames: ['event_id', 'user_id'], isUnique: true }));

    // Inserir dados iniciais de tipos de evento
    await queryRunner.query(`
      INSERT INTO event_types (name, description, color, "onePerDay", "monthsInAdvance", "requiresApproval")
      VALUES 
        ('rock', 'Eventos de música rock com bandas locais', '#FF6B6B', true, 6, true),
        ('social', 'Eventos sociais e confraternizações', '#4ECDC4', false, null, false),
        ('interreps', 'Eventos entre repúblicas', '#45B7D1', false, null, false),
        ('festa', 'Festas e celebrações', '#96CEB4', false, null, false),
        ('cultural', 'Eventos culturais e educativos', '#FECA57', false, null, false)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign keys
    const eventsTable = await queryRunner.getTable('events');
    const eventRepublicsTable = await queryRunner.getTable('event_republics');
    const eventInvitesTable = await queryRunner.getTable('event_invites');

    if (eventsTable) {
      const eventsForeignKeys = eventsTable.foreignKeys;
      for (const foreignKey of eventsForeignKeys) {
        await queryRunner.dropForeignKey('events', foreignKey);
      }
    }

    if (eventRepublicsTable) {
      const eventRepublicsForeignKeys = eventRepublicsTable.foreignKeys;
      for (const foreignKey of eventRepublicsForeignKeys) {
        await queryRunner.dropForeignKey('event_republics', foreignKey);
      }
    }

    if (eventInvitesTable) {
      const eventInvitesForeignKeys = eventInvitesTable.foreignKeys;
      for (const foreignKey of eventInvitesForeignKeys) {
        await queryRunner.dropForeignKey('event_invites', foreignKey);
      }
    }

    // Remover tabelas
    await queryRunner.dropTable('event_invites', true);
    await queryRunner.dropTable('event_republics', true);
    await queryRunner.dropTable('events', true);
    await queryRunner.dropTable('event_types', true);

    // Remover ENUM types
    await queryRunner.query(`DROP TYPE IF EXISTS "event_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "event_visibility_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "invite_status_enum"`);
  }
} 