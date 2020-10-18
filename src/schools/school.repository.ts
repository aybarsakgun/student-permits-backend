import { EntityRepository, Repository } from 'typeorm';

import { School } from './school.model';

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {}
