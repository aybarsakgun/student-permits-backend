import { getRepository, Repository } from 'typeorm';

import { User } from '../../users/user.model';
import { BaseModel } from '../models';

export function resolveRelation<T extends BaseModel, K extends keyof T>(repository: Repository<T>, relation: K) {
  return async (entity: T, userId?: string, roles?: string[], relationType: 'array' | 'object' = 'array') => {
    if (userId && roles && roles.length) {
      const findUser = await getRepository(User).findOneOrFail(userId);
      if (!roles.includes(findUser.role)) {
        return relationType === 'array' ? [] : null;
      }
    }
    const record = await repository.findOne(entity.id, { relations: [relation as string], withDeleted: true });
    return record[relation];
  };
}
