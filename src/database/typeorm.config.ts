import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { DataSourceOptions } from "typeorm";
import type { EnvVariables } from "../config/env.schema.js";

export type TypeOrmEnviroment = Readonly<Pick<
EnvVariables, 'NODE_ENV'|'DB_HOST'|'DB_PORT'|'DB_USER'|'DB_PASSWORD'|'DB_NAME' >>

const entitiesDirectory = dirname(fileURLToPath(import.meta.url));

export function createTypeOrmOptions(
    enviroment: TypeOrmEnviroment): DataSourceOptions{
        return {
            type: 'postgres',
            host: enviroment.DB_HOST,
            port: enviroment.DB_PORT,
            username: enviroment.DB_USER,
            password: enviroment.DB_PASSWORD,
            database: enviroment.DB_NAME,

            entities: [
                join(entitiesDirectory, '..', '**', '*.entity.{ts,js}')
            ],

            synchronize: false,
            migrationsRun: false,
            migrationsTableName: 'typeorm_migrations',

            logging: enviroment.NODE_ENV === 'development'
        }
    }