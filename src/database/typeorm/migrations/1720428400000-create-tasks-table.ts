import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1720428400000 implements MigrationInterface {
  name = 'CreateTasksTable1720428400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" character varying(255) NOT NULL,
        "category" character varying(255),
        "description" text,
        "is_completed" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks";`);
  }
}
