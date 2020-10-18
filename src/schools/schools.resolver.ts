import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Class } from '../classes/class.model';
import { AdminGuard } from '../common/guards';
import { CreateSchoolInput } from './dto/create-school.input';
import { DeleteSchoolArgs } from './dto/delete-school.args';
import { GetSchoolArgs } from './dto/get-school.args';
import { UpdateSchoolInput } from './dto/update-school.input';
import { School } from './school.model';
import { SchoolsService } from './schools.service';
import { GetSchoolsArgs } from './dto/get-schools.args';

@Resolver(of => School)
export class SchoolsResolver {
  constructor(private readonly schoolsService: SchoolsService) {}

  @ResolveField('classes', returns => [Class])
  getClasses(@Parent() school: School) {
    return this.schoolsService.getClasses(school);
  }

  @Query(returns => [School], { name: 'schools' })
  getSchools(@Args() args?: GetSchoolsArgs) {
    return this.schoolsService.findAll(args);
  }

  @Query(returns => School, { name: 'school' })
  getSchool(@Args() args: GetSchoolArgs) {
    return this.schoolsService.findByIdOrThrow(args.id);
  }

  @Mutation(returns => School)
  @AdminGuard()
  createSchool(@Args('data') input: CreateSchoolInput) {
    return this.schoolsService.create(input);
  }

  @Mutation(returns => School)
  @AdminGuard()
  updateSchool(@Args('data') input: UpdateSchoolInput) {
    return this.schoolsService.update(input);
  }

  @Mutation(returns => Boolean)
  @AdminGuard()
  deleteSchool(@Args() args: DeleteSchoolArgs) {
    return this.schoolsService.delete(args.id);
  }
}
