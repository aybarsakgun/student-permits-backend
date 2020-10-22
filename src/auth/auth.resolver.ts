import { Context, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';

import { Public } from '../common/decorators';
import { env } from '../common/env';

@Resolver(of => Boolean)
@Public()
export class AuthResolver {
  @Mutation(returns => Boolean)
  signOut(@Context('req') req: Request) {
    req.res.clearCookie(env.TOKEN_COOKIE_NAME);
    return true;
  }
}
