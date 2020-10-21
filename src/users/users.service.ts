import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ClassRepository } from '../classes/class.repository';
import { brackets, resolveRelation } from '../common/utils';
import { SchoolRepository } from '../schools/school.repository';
import { MailerService } from '../services';
import { CreateUserInput, DeleteUserArgs, GetUsersArgs, UpdateUserInput } from './dto';
import { UserRole } from './user.model';
import { UserRepository } from './user.repository';
import { AuthenticatedUser } from '../common/decorators';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(ClassRepository)
    private readonly classRepository: ClassRepository,
    @InjectRepository(SchoolRepository)
    private readonly schoolRepository: SchoolRepository,
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
  ) {}

  getClasses = resolveRelation(this.userRepository, 'classes');

  getSchool = resolveRelation(this.userRepository, 'school');

  async findById(id: string, userId: string) {
    if (!id) {
      throw new BadRequestException();
    }

    const authenticatedUser = await this.userRepository.findOneOrFail(userId);

    const findUser = await this.userRepository.findOneOrFail(id, {
      relations: ['classes', 'classes.users'],
    });

    switch (authenticatedUser.role) {
      case UserRole.SCHOOL_ADMIN:
        if (findUser.schoolId !== authenticatedUser.schoolId) {
          throw new ForbiddenException('You cannot get user in any school other than your own.');
        }
        break;
      case UserRole.TEACHER:
        if (!findUser.classes.find(_class => _class.users.some(user => user.id === authenticatedUser.id))) {
          throw new ForbiddenException('You cannot get a student to whom you are not a teacher.');
        }
        break;
      default:
        break;
    }

    // return this.userRepository.findOne(id, {
    //   relations: ['classes', 'school'],
    // });
    return findUser;
  }

  me(userId: string) {
    return this.userRepository.findOneOrFail(userId);
  }

  findAll({ role, search, ids, withDeleted }: GetUsersArgs) {
    const query = this.userRepository.createQueryBuilder('user');

    query.andWhere('user.role <> :role', { role: UserRole.ADMIN });

    if (ids && ids.length) {
      query.andWhereInIds(ids);
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (search) {
      const searchQuery = brackets(
        ['user.name LIKE :search', 'user.surname LIKE :search', 'user.email LIKE :search'].join(' OR '),
      );

      query.andWhere(searchQuery, { search: `%${search}%` });
    }

    if (withDeleted) {
      query.withDeleted();
    }

    query.orderBy('user.createdAt', 'ASC');

    return query.getMany();
  }

  async create(input: CreateUserInput, userId: string) {
    const checkSchool = await this.schoolRepository.findOneOrFail(input.schoolId);

    const findUser = await this.userRepository.findOneOrFail(userId);

    if (findUser.role !== UserRole.ADMIN && findUser.schoolId !== checkSchool.id) {
      throw new ForbiddenException('You cannot create user in any school other than your own.');
    }

    const checkAvailableClasses = await this.classRepository
      .createQueryBuilder('class')
      .andWhereInIds(input.classIds)
      .andWhere('class.schoolId = :school', {
        school: checkSchool.id,
      })
      .getMany();

    const user = await this.userRepository.save({
      ...input,
      classes: checkAvailableClasses,
    });

    await this.mailerService.sendInvitationEmail({
      to: input.email,
    });

    return user;
  }

  async update({ id, ...input }: UpdateUserInput) {
    const rawUser = await this.userRepository.findOneOrFail(id);

    return this.userRepository.save({ ...rawUser, ...input });
  }

  async delete({ id }: DeleteUserArgs) {
    const user = await this.userRepository.findOneOrFail(id, { relations: ['classes', 'school'] });

    if (user.classes) {
      await this.userRepository.softRemove(user);
    } else {
      await this.userRepository.remove(user);
    }

    return true;
  }
}
