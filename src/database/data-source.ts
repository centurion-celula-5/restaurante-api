import { existsSync } from "node:fs"; //File System
import { dirname, join, resolve } from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

import { envSchema } from "../config/env.schema.js";
import { DataSource } from "typeorm";
import { createTypeOrmOptions } from "./typeorm.config.js";


const envFilePath = resolve(process.cwd(), '.env');

if(existsSync(envFilePath)){
    loadEnvFile(envFilePath)
}

const enviroment = envSchema.parse(process.env);
const databaseDirectory = dirname(fileURLToPath(import.meta.url))

export const AppDataSource = new DataSource({
    ...createTypeOrmOptions(enviroment),

    entities: [
        join(databaseDirectory, '..', '**', '*.entity.{ts,js}' ),
    ],

    migrations: [
        join(databaseDirectory, 'migrations', '*.{ts,js}')
    ]
})



/*file\\C:\Users\ACER-NITROLITE\OneDrive\Desktop\Ruta avanzada\Nestjs\restaurante-api> */