import * as z from 'zod';

export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    HOST: z.string().trim().min(1).default('localhost'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3020),

    DB_HOST: z.string().trim().min(1),
    DB_PORT: z.coerce.number().int().min(1).max(65535),
    DB_USER: z.string().trim().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().trim().min(1)
});

export type EnvVariables = z.infer<typeof envSchema>
