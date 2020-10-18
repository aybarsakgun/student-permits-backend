import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { brackets, resolveAsyncRelation } from '../common/utils';
import { SchoolRepository } from '../schools/school.repository';
import { UserRole } from '../users/user.model';
import { UserRepository } from '../users/user.repository';
import { ClassRepository } from './class.repository';
import { CreateClassInput, DeleteClassArgs, GetClassesArgs, UpdateClassInput } from './dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(SchoolRepository)
    private readonly schoolRepository: SchoolRepository,
    private readonly classRepository: ClassRepository,
  ) {}

  getUsers = resolveAsyncRelation(this.classRepository, 'users');

  getSchool = resolveAsyncRelation(this.classRepository, 'school');

  findById(id: string) {
    if (!id) return null;

    return this.classRepository.findOne(id, {
      relations: ['users', 'school'],
    });
  }

  findByIdOrThrow(id: string) {
    if (!id) throw new BadRequestException();

    return this.classRepository.findOneOrFail(id);
  }

  findAll({ search }: GetClassesArgs) {
    const query = this.classRepository.createQueryBuilder('class');

    if (search) {
      const searchQuery = brackets(['class.name LIKE :search'].join(' OR '));

      query.andWhere(searchQuery, { search: `%${search}%` });
    }

    query.orderBy('class.createdAt', 'DESC');

    return query.getMany();
  }

  async create(input: CreateClassInput, userId: string) {
    const checkSchool = await this.schoolRepository.findOneOrFail(input.schoolId);

    const findUser = await this.userRepository.findOneOrFail(userId);

    if (findUser.role !== UserRole.ADMIN && findUser.schoolId !== checkSchool.id) {
      throw new ForbiddenException('You cannot create class in any school other than your own.');
    }

    // if (findUser.role !== UserRole.SCHOOL_ADMIN && findUser.role !== UserRole.TEACHER) {
    //   throw new ForbiddenException('You are not authorized for this transaction.');
    // }

    const checkAvailableUsers = await this.userRepository
      .createQueryBuilder('user')
      .andWhereInIds(input.usersIds)
      .andWhere('(user.role = :role1 OR user.role = :role2)', {
        role1: UserRole.STUDENT,
        role2: UserRole.TEACHER,
      })
      .andWhere('user.schoolId = :school', { school: checkSchool.id })
      .getMany();

    return this.classRepository.save({
      ...input,
      users: checkAvailableUsers.map(user => ({ id: user.id })),
    });
  }

  async update({ id, ...input }: UpdateClassInput, userId: string) {
    const rawClass = await this.classRepository.findOneOrFail(id);

    const checkSchool = await this.schoolRepository.findOneOrFail(input.schoolId);

    const findUser = await this.userRepository.findOneOrFail(userId);

    if (findUser.role !== UserRole.ADMIN && findUser.schoolId !== checkSchool.id) {
      throw new ForbiddenException('You cannot update class in any school other than your own.');
    }

    // if (findUser.role !== UserRole.SCHOOL_ADMIN && findUser.role !== UserRole.TEACHER) {
    //   throw new ForbiddenException('You are not authorized for this transaction.');
    // }

    const checkAvailableUsers = await this.userRepository
      .createQueryBuilder('user')
      .andWhereInIds(input.usersIds)
      .andWhere('(user.role = :role1 OR user.role = :role2)', {
        role1: UserRole.STUDENT,
        role2: UserRole.TEACHER,
      })
      .andWhere('user.schoolId = :school', { school: checkSchool.id })
      .getMany();

    return this.classRepository.save({
      ...rawClass,
      ...input,
      users: checkAvailableUsers.map(user => ({ id: user.id })),
    });
  }

  async delete({ id }: DeleteClassArgs) {
    const findClass = await this.findByIdOrThrow(id);

    await this.classRepository.remove(findClass);

    return true;
  }
}
