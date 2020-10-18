import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class GetClassesArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
