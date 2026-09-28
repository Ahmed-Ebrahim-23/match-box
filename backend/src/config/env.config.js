const z = require('zod');
require('dotenv').config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  CLIENT_ORIGIN: z.url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const _env = envSchema.parse(process.env);

module.exports = _env;
