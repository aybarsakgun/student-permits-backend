import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Class } from '../classes/class.model';
import { UserId } from '../common/decorators';
import { AdminGuard } from '../common/guards';
import { School } from '../schools/school.model';
import { CreateUserInput, DeleteUserArgs, GetUserArgs, GetUsersArgs, UpdateUserInput } from './dto';
import { User } from './user.model';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveField('classes', returns => [Class])
  getClasses(@Parent() user: User) {
    return this.usersService.getClasses(user);
  }

  @ResolveField('school', returns => School)
  getSchool(@Parent() user: User) {
    return this.usersService.getSchool(user);
  }

  @Query(returns => User, { name: 'user' })
  getUser(@Args() args: GetUserArgs) {
    return this.usersService.findById(args.id);
  }

  @Query(returns => User, { name: 'me' })
  getMe(@UserId() userId: string) {
    return this.usersService.findById(userId);
  }

  @Query(returns => [User], { name: 'users' })
  getUsers(@Args() args?: GetUsersArgs) {
    return this.usersService.findAll(args);
  }

  @Mutation(returns => User)
  @AdminGuard()
  createUser(@Args('data') input: CreateUserInput, @UserId() userId: string) {
    return this.usersService.create(input, userId);
  }

  @Mutation(returns => User)
  @AdminGuard()
  updateUser(@Args('data') input: UpdateUserInput) {
    return this.usersService.update(input);
  }

  @Mutation(returns => Boolean)
  @AdminGuard()
  deleteUser(@Args() args: DeleteUserArgs) {
    return this.usersService.delete(args);
  }
}
