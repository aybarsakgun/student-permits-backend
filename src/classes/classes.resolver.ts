import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { AdminGuard } from '../common/guards';
import { School } from '../schools/school.model';
import { User } from '../users/user.model';
import { Class } from './class.model';
import { ClassesService } from './classes.service';
import { CreateClassInput, DeleteClassArgs, GetClassArgs, GetClassesArgs, UpdateClassInput } from './dto';
import { UserId } from '../common/decorators';

@Resolver(of => Class)
export class ClassesResolver {
  constructor(private readonly classesService: ClassesService) {}

  @ResolveField('users', returns => [User])
  async getUsers(@Parent() _class: Class) {
    return this.classesService.getUsers(_class);
  }

  @ResolveField('school', returns => School)
  async getSchool(@Parent() _class: Class) {
    return this.classesService.getSchool(_class);
  }

  @Query(returns => [Class], { name: 'class' })
  getClass(@Args() args?: GetClassArgs) {
    return this.classesService.findById(args.id);
  }

  @Query(returns => [Class], { name: 'classes' })
  getClasses(@Args() args?: GetClassesArgs) {
    return this.classesService.findAll(args);
  }

  @Mutation(returns => Class)
  @AdminGuard()
  createClass(@Args('data') input: CreateClassInput, @UserId() userId: string) {
    return this.classesService.create(input, userId);
  }

  @Mutation(returns => Class)
  @AdminGuard()
  updateClass(@Args('data') input: UpdateClassInput, @UserId() userId: string) {
    return this.classesService.update(input, userId);
  }

  @Mutation(returns => Boolean)
  @AdminGuard()
  deleteClass(@Args() args: DeleteClassArgs) {
    return this.classesService.delete(args);
  }
}
