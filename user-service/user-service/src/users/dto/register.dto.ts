import {
  IsEmail, IsString, IsOptional,
  MinLength, MaxLength, Matches, IsDateString
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'El username debe tener mínimo 3 caracteres' })
  @MaxLength(30, { message: 'El username debe tener máximo 30 caracteres' })
  @Matches(/^\S+$/, { message: 'El username no puede tener espacios' })
  username: string;

  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  @MaxLength(10, { message: 'La contraseña debe tener máximo 10 caracteres' })
  @Matches(/(?=.*[0-9])/, { message: 'La contraseña debe contener al menos un número' })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { message: 'La contraseña debe contener al menos un símbolo' })
  password: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe tener exactamente 10 dígitos numéricos' })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
  birthdate?: string;
}