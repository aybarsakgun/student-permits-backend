import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateSchoolInput {
  @Field(type => ID)
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;
}
