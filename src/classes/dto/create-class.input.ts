import { Field, ID, InputType } from '@nestjs/graphql';
import { Contains, IsArray, IsHexColor, IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { Class } from '../class.model';

@InputType()
export class CreateClassInput implements Partial<Class> {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsHexColor()
  @Contains('#')
  color: string;

  @Field(type => ID)
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  schoolId: string;

  @Field(type => [ID])
  @IsNotEmpty()
  @IsArray()
  @IsUUID('all', { each: true })
  usersIds: string[];
}
