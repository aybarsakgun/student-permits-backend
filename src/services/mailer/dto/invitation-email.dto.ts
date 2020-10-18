import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InvitationEmailDto {
  @Expose()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  to: string;

  // @Expose()
  // @IsString()
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;
}
