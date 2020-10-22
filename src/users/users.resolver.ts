import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Class } from '../classes/class.model';
import { School } from '../schools/school.model';
import { CreateUserInput, DeleteUserArgs, GetUserArgs, GetUsersArgs, UpdateUserInput } from './dto';
import { User, UserRole } from './user.model';
import { UsersService } from './users.service';
import { AuthenticatedUser, Roles } from '../common/decorators';
import { GetSchoolArgs } from '../schools/dto/get-school.args';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveField('classes', returns => [Class])
  getClasses(@Parent() user: User, @AuthenticatedUser() userId: string) {
    return this.usersService.getClasses(user, userId, [UserRole.ADMIN, UserRole.SCHOOL_ADMIN]);
  }

  @ResolveField('school', returns => School)
  getSchool(@Parent() user: User) {
    return this.usersService.getSchool(user);
  }

  @Query(returns => User, { name: 'user' })
  @Roles([UserRole.ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER])
  getUser(@Args() args: GetUserArgs, @AuthenticatedUser() userId: string) {
    return this.usersService.findById(args.id, userId);
  }

  @Query(returns => User, { name: 'me' })
  getMe(@AuthenticatedUser() userId: string) {
    return this.usersService.me(userId);
  }

  @Query(returns => [User], { name: 'users' })
  @Roles([UserRole.ADMIN])
  getUsers(@Args() args?: GetUsersArgs) {
    return this.usersService.findAll(args);
  }

  @Mutation(returns => User)
  @Roles([UserRole.ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER])
  createUser(@Args('data') input: CreateUserInput, @AuthenticatedUser() userId: string) {
    return this.usersService.create(input, userId);
  }

  @Mutation(returns => User)
  updateUser(@Args('data') input: UpdateUserInput) {
    return this.usersService.update(input);
  }

  @Mutation(returns => Boolean)
  @Roles([UserRole.ADMIN, UserRole.SCHOOL_ADMIN])
  deleteUser(@Args() args: DeleteUserArgs) {
    return this.usersService.delete(args);
  }
}
