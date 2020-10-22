import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { brackets, resolveRelation } from '../common/utils';
import { UserRole } from '../users/user.model';
import { UserRepository } from '../users/user.repository';
import { CreateSchoolInput } from './dto/create-school.input';
import { GetSchoolsArgs } from './dto/get-schools.args';
import { UpdateSchoolInput } from './dto/update-school.input';
import { SchoolRepository } from './school.repository';

@Injectable()
export class SchoolsService {
  constructor(
    private readonly schoolRepository: SchoolRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  getClasses = resolveRelation(this.schoolRepository, 'classes');

  async findById(id: string, userId: string) {
    if (!id) {
      throw new BadRequestException();
    }

    const findUser = await this.userRepository.findOneOrFail(userId);

    if (findUser.role === UserRole.SCHOOL_ADMIN && findUser.schoolId !== id) {
      throw new ForbiddenException('You can only get your own schools.');
    }

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
