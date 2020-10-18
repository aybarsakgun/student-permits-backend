export type EnvVariables = Readonly<{
  NODE_ENV: 'development' | 'test' | 'production';
  APP_ENV: 'local' | 'review' | 'staging' | 'production';

  PORT: number;
  CLIENT_URL: string;

  // database
  DATABASE_URL: string;

  // jwt
  JWT_SECRET: string;
  COOKIE_SECRET: string;
  TOKEN_COOKIE_NAME: string;
  TOKEN_PREFIX: string;

  // heroku variables
  NPM_CONFIG_PRODUCTION: boolean;

  // google auth
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;

  // sendgrid
  SENDGRID_KEY: string;
}>;
