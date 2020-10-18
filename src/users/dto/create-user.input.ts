import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { UserRole } from '../user.model';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(type => UserRole)
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @Field(type => ID)
  @IsOptional()
  @IsUUID()
  schoolId: string;

  @Field(type => [ID])
  @IsOptional()
  @IsUUID('all', { each: true })
  classIds?: string[];
}
