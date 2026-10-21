import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const required = ["DATABASE_URL", "JWT_SECRET", "COOKIE_SECRET"]
const missing = required.filter((key) => !process.env[key])

if (missing.length && process.env.NODE_ENV === "production") {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
}

const modules = process.env.REDIS_URL
  ? [
      {
        resolve: "@medusajs/medusa/cache-redis",
        options: { redisUrl: process.env.REDIS_URL },
      },
      {
        resolve: "@medusajs/medusa/event-bus-redis",
        options: { redisUrl: process.env.REDIS_URL },
      },
      {
        resolve: "@medusajs/medusa/workflow-engine-redis",
        options: { redis: { redisUrl: process.env.REDIS_URL } },
      },
    ]
  : [
      { resolve: "@medusajs/medusa/cache-inmemory" },
      { resolve: "@medusajs/medusa/event-bus-local" },
      { resolve: "@medusajs/medusa/workflow-engine-inmemory" },
    ]

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions:
      process.env.DATABASE_SSL === "false"
        ? {}
        : { connection: { ssl: { rejectUnauthorized: false } } },
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:8000,http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "dev-only-change-me",
      cookieSecret: process.env.COOKIE_SECRET || "dev-only-change-me",
    },
  },
  modules,
})
