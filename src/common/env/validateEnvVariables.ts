import Joi from '@hapi/joi';
import dotenv from 'dotenv';

import { EnvVariables } from './env.types';
import { productionRequiredString, requiredInProduction } from './env.utils';

export class EnvConfig {
  constructor() {
    dotenv.config();

    this.envConfig = this.validateEnvVariables(process.env);
  }

  readonly envConfig: EnvVariables;

  private validateEnvVariables = (env: dotenv.DotenvParseOutput): EnvVariables => {
    const appEnvValidation = Joi.string()
      .valid('local', 'review', 'staging', 'production')
      .default('local')
      .validate(env.APP_ENV);

    if (appEnvValidation.error) {
      throw new Error(`Config validation error: ${appEnvValidation.error.message}`);
    }

    const appEnv: EnvVariables['APP_ENV'] = appEnvValidation.value;

    const envVarsSchema: Joi.ObjectSchema<EnvVariables> = Joi.object({
      NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),

      PORT: Joi.number().default(4000),
      CLIENT_URL: Joi.string().allow('').default(''),

      // database
      DATABASE_URL: Joi.string().required(),

      // jwt
      JWT_SECRET: Joi.string().required(),
      COOKIE_SECRET: Joi.string().required(),
      TOKEN_COOKIE_NAME: Joi.string().required(),
      TOKEN_PREFIX: Joi.string().required(),

      // heroku variables
      NPM_CONFIG_PRODUCTION: requiredInProduction(appEnv, { joiType: Joi.boolean(), defaultValue: false }),

      // google auth
      GOOGLE_CLIENT_ID: productionRequiredString(appEnv),
      GOOGLE_CLIENT_SECRET: productionRequiredString(appEnv),

      // sendgrid
      SENDGRID_KEY: appEnv === 'local' ? Joi.string().optional() : Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(env, { stripUnknown: true });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    const config = validatedEnvConfig as EnvVariables;

    return {
      ...config,
      APP_ENV: appEnv,
    };
  };
}
