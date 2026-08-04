import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config();

const envVarsSchema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().default(5000),
  MONGODB_URI: joi.string().required(),
  TENANT_NAME: joi.string().default('landscapes_integrity_solutions'),
  REDIS_URL: joi.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: joi.string().required(),
  JWT_REFRESH_SECRET: joi.string().required(),
  GOOGLE_CLIENT_ID: joi.string().required(),
  GOOGLE_CLIENT_SECRET: joi.string().required(),
  GOOGLE_CALLBACK_URL: joi.string().uri().required(),
  MASTER_GOOGLE_CALLBACK_URL: joi.string().uri().required(),
  FRONTEND_URL: joi.string().uri().required(),
  SMTP_HOST: joi.string().default('smtp.gmail.com'),
  SMTP_PORT: joi.number().default(587),
  SMTP_SECURE: joi.boolean().default(false),
  SMTP_USER: joi.string().default(''),
  SMTP_PASS: joi.string().default(''),
  SMTP_FROM: joi.string().email().default('noreply@example.com'),
  FALLBACK_CONTACT_EMAIL: joi.string().email().default(''),
  AWS_ACCESS_KEY_ID: joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: joi.string().optional(),
  AWS_REGION: joi.string().default('us-east-1'),
  AWS_S3_BUCKET: joi.string().optional(),
  OTLP_ENDPOINT: joi.string().uri().default('http://localhost:4318/v1/traces'),
  RECAPTCHA_SITE_KEY: joi.string().default(''),
  RECAPTCHA_SECRET_KEY: joi.string().default(''),
  RECAPTCHA_ENABLED: joi.boolean().default(true),
  MAX_PAYLOAD_SIZE: joi.number().default(1048576),
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);
if (error) {
  console.error('Config validation error:', error.message);
  console.error('Missing or invalid environment variables');
  // Don't throw in production, use defaults
  if (process.env.NODE_ENV === 'production') {
    console.warn('Using defaults for missing variables');
  } else {
    throw new Error(`Config validation error: ${error.message}`);
  }
}

// Warn if SMTP credentials are missing (email sending will fail)
if (!envVars.SMTP_USER || !envVars.SMTP_PASS) {
  console.warn(' SMTP_USER or SMTP_PASS is not set – email sending will not work.');
}
if (!envVars.FALLBACK_CONTACT_EMAIL && envVars.NODE_ENV === 'production') {
  console.warn(' FALLBACK_CONTACT_EMAIL not set – tenant notifications may fail.');
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongodbUri: envVars.MONGODB_URI,
  defaultTenantDbName: envVars.TENANT_NAME,
  redisUrl: envVars.REDIS_URL,
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackUrl: envVars.GOOGLE_CALLBACK_URL,
    masterCallbackUrl: envVars.MASTER_GOOGLE_CALLBACK_URL,
  },
  frontendUrl: envVars.FRONTEND_URL,
  email: {
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT,
    secure: envVars.SMTP_SECURE,
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
    from: envVars.SMTP_FROM,
  },
  fallbackContactEmail: envVars.FALLBACK_CONTACT_EMAIL || envVars.SMTP_FROM || '',
  aws: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    region: envVars.AWS_REGION,
    bucket: envVars.AWS_S3_BUCKET,
  },
  otlpEndpoint: envVars.OTLP_ENDPOINT,
  express: {
    jsonLimit: process.env.NODE_ENV === 'production' ? '2mb' : '10mb',
    compressionLevel: process.env.NODE_ENV === 'production' ? 6 : 1,
  },
  recaptcha: {
    siteKey: envVars.RECAPTCHA_SITE_KEY,
    secretKey: envVars.RECAPTCHA_SECRET_KEY,
    enabled: envVars.RECAPTCHA_ENABLED,
  },
  maxPayloadSize: envVars.MAX_PAYLOAD_SIZE,
};
