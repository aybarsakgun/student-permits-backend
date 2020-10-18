import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';

import { brackets, resolveAsyncRelation } from '../common/utils';
import { CreateSchoolInput } from './dto/create-school.input';
import { GetSchoolsArgs } from './dto/get-schools.args';
import { UpdateSchoolInput } from './dto/update-school.input';
import { SchoolRepository } from './school.repository';

@Injectable()
export class SchoolsService {
  constructor(private readonly schoolRepository: SchoolRepository) {
  }

  getClasses = resolveAsyncRelation(this.schoolRepository, 'classes');

  findByIdOrThrow(id: string) {
    if (!id) throw new BadRequestException();

    return this.schoolRepository.findOneOrFail(id);
  }

  findAll({ search }: GetSchoolsArgs) {
    const query = this.schoolRepository.createQueryBuilder('school');

    if (search) {
      const searchQuery = brackets(
        ['school.name LIKE :search'].join(' OR '),
      );

      query.andWhere(searchQuery, { search: `%${search}%` });
    }

    return query.getMany();
  }

  create(input: CreateSchoolInput) {
    return this.schoolRepository.save(input);
  }

  async update({ id, ...input }: UpdateSchoolInput) {
    const school = await this.schoolRepository.findOneOrFail(id);

    return this.schoolRepository.save({ ...school, ...input });
  }

  async delete(id: string) {
    const school = await this.schoolRepository.findOneOrFail(id, { relations: ['classes'] });

    if (school.classes.length) {
      throw new ConflictException('You cannot remove a school with classes');
    }

    await this.schoolRepository.remove(school);

    return true;
  }
}
