import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1733447600000 implements MigrationInterface {
    name = 'InitialSchema1733447600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "age" integer,
                "location" character varying,
                "email" character varying,
                "phone" character varying NOT NULL,
                "event" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_phone" UNIQUE ("phone")
            )
        `);

        // Create index on phone
        await queryRunner.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "IDX_users_phone" ON "users" ("phone")
        `);

        // Create duplicate_logs table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "duplicate_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "identifier" character varying NOT NULL,
                "count" integer NOT NULL DEFAULT 1,
                "data" jsonb,
                "lastAttemptAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_duplicate_logs_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_duplicate_logs_identifier" UNIQUE ("identifier")
            )
        `);

        // Create index on identifier
        await queryRunner.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "IDX_duplicate_logs_identifier" ON "duplicate_logs" ("identifier")
        `);

        // Enable uuid-ossp extension if not already enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_duplicate_logs_identifier"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_phone"`);
        
        // Drop tables
        await queryRunner.query(`DROP TABLE IF EXISTS "duplicate_logs"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
}
