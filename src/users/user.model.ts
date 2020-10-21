import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

import { Class } from '../classes/class.model';
import { EMPTY_USER_IMAGE } from '../common/constants';
import { BaseModel } from '../common/models';
import { School } from '../schools/school.model';

export enum UserRole {
  ADMIN = 'ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity()
export class User extends BaseModel {
  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field()
  @Column({ default: EMPTY_USER_IMAGE })
  image?: string;

  @Field(type => School)
  @ManyToOne(type => School)
  school: School;

  @Column({ nullable: true })
  schoolId?: string;

  @Field(type => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Field(type => [Class], { nullable: true })
  @ManyToMany(type => Class, _class => _class.users)
  classes?: Class[];
}
