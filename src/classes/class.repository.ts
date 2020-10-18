import { EntityRepository, Repository } from 'typeorm';

import { Class } from './class.model';

@EntityRepository(Class)
export class ClassRepository extends Repository<Class> {}
