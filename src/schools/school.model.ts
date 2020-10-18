import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

import { Class } from '../classes/class.model';
import { BaseModel } from '../common/models';

@ObjectType()
@Entity()
export class School extends BaseModel {
  @Field()
  @Column({ unique: true })
  name: string;

  @Field(type => [Class], { nullable: true })
  @OneToMany(type => Class, _class => _class.school)
  classes?: Class[];
}
