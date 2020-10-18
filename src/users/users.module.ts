import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClassRepository } from '../classes/class.repository';
import { SchoolRepository } from '../schools/school.repository';
import { UserRepository } from './user.repository';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, ClassRepository, SchoolRepository])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
