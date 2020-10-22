import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Class } from '../classes/class.model';
import { CreateSchoolInput } from './dto/create-school.input';
import { DeleteSchoolArgs } from './dto/delete-school.args';
import { GetSchoolArgs } from './dto/get-school.args';
import { UpdateSchoolInput } from './dto/update-school.input';
import { School } from './school.model';
import { SchoolsService } from './schools.service';
import { GetSchoolsArgs } from './dto/get-schools.args';
import { AuthenticatedUser, Roles } from '../common/decorators';
import { UserRole } from '../users/user.model';

@Resolver(of => School)
export class SchoolsResolver {
  constructor(private readonly schoolsService: SchoolsService) {}

  @ResolveField('classes', returns => [Class])
  getClasses(@Parent() school: School, @AuthenticatedUser() userId: string) {
    return this.schoolsService.getClasses(school, userId, [UserRole.ADMIN, UserRole.SCHOOL_ADMIN]);
  }

  @Query(returns => [School], { name: 'schools' })
  @Roles([UserRole.ADMIN])
  getSchools(@Args() args?: GetSchoolsArgs) {
    return this.schoolsService.findAll(args);
  }

  @Query(returns => School, { name: 'school' })
  @Roles([UserRole.ADMIN, UserRole.SCHOOL_ADMIN])
  getSchool(@Args() args: GetSchoolArgs, @AuthenticatedUser() userId: string) {
    return this.schoolsService.findById(args.id, userId);
  }

  @Mutation(returns => School)
  @Roles([UserRole.ADMIN])
  createSchool(@Args('data') input: CreateSchoolInput) {
    return this.schoolsService.create(input);
  }

  @Mutation(returns => School)
  @Roles([UserRole.ADMIN, UserRole.SCHOOL_ADMIN])
  updateSchool(@Args('data') input: UpdateSchoolInput) {
    return this.schoolsService.update(input);
  }

  @Mutation(returns => Boolean)
  @Roles([UserRole.ADMIN])
  deleteSchool(@Args() args: DeleteSchoolArgs) {
    return this.schoolsService.delete(args.id);
  }
}
