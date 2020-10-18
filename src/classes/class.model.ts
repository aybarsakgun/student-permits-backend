import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { BaseModel } from '../common/models';
import { School } from '../schools/school.model';
import { User } from '../users/user.model';

@ObjectType()
@Entity()
export class Class extends BaseModel {
  @Column({ unique: true })
  @Field()
  name: string;

  @Column()
  @Field()
  color: string;

  @Field(type => School)
  @ManyToOne(type => School)
  school: School;

  @Field()
  @Column()
  schoolId: string;

  @Field(type => [User], { nullable: true })
  @ManyToMany(type => User, user => user.classes)
  @JoinTable()
  users: User[];
}
