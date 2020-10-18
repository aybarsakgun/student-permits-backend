import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateClassInput } from './create-class.input';

@InputType()
export class UpdateClassInput extends CreateClassInput {
  @Field(type => ID)
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
