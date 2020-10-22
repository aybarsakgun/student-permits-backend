import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getRepository } from 'typeorm';

import { User } from '../../users/user.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || !roles.length) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);

    const { user } = ctx.getContext().req;

    const getUser = await getRepository(User).findOneOrFail(user.id);

    return roles.includes(getUser.role);
  }
}
