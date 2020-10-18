import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolRepository } from '../schools/school.repository';
import { UserRepository } from '../users/user.repository';
import { ClassRepository } from './class.repository';
import { ClassesResolver } from './classes.resolver';
import { ClassesService } from './classes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClassRepository, UserRepository, SchoolRepository])],
  providers: [ClassesResolver, ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
