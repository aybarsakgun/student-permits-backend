import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsLowercase, Matches } from 'class-validator';

export const IsGMail = () => applyDecorators(IsEmail(), IsLowercase(), Matches(/.*@gmail\.com$/));
