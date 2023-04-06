import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z
    .string()
    .transform((port) => Number(port))
    .default('3334'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['pg', 'sqlite']),
  MIGRATIONS_DIRECTORY: z.string(),
  SEEDS_DIRECTORY: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error(
    `⚠️  Invalid environment variables: ${JSON.stringify(_env.error.format())}`,
  )
  process.exit(1)
}

export const env = _env.data
