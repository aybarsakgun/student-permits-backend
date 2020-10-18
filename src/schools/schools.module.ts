import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolRepository } from './school.repository';
import { SchoolsResolver } from './schools.resolver';
import { SchoolsService } from './schools.service';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolRepository])],
  providers: [SchoolsResolver, SchoolsService],
})
export class SchoolsModule {}
