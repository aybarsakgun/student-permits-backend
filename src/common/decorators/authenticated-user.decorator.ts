import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { RequestUser } from '../typings';

export const AuthenticatedUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): RequestUser => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user.id;
  },
);
