import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field(type => [ID])
  @IsOptional()
  @IsUUID('all', { each: true })
  classIds?: string[];
}
