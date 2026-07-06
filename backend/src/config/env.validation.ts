import * as Joi from 'joi';

// Fail fast on boot if the environment is misconfigured. Payment/email secrets
// are optional until their phases land, so they are allowed to be empty here.
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(4000),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  DATABASE_URL: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_TTL: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_TTL: Joi.string().default('30d'),

  CHAPA_SECRET_KEY: Joi.string().allow('').default(''),
  CHAPA_WEBHOOK_SECRET: Joi.string().allow('').default(''),
  PLATFORM_COMMISSION_PERCENT: Joi.number().min(0).max(100).default(15),

  RESEND_API_KEY: Joi.string().allow('').default(''),
  EMAIL_FROM: Joi.string().default('CoachBridge <no-reply@coachbridge.et>'),

  UPLOAD_DIR: Joi.string().default('./uploads'),
});
