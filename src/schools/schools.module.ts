import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolRepository } from './school.repository';
import { SchoolsResolver } from './schools.resolver';
import { SchoolsService } from './schools.service';
import { UserRepository } from '../users/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolRepository, UserRepository])],
  providers: [SchoolsResolver, SchoolsService],
})
export class SchoolsModule {}
