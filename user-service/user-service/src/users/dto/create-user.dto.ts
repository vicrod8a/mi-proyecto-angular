import {
  IsEmail, IsString, IsOptional, MinLength,
  MaxLength, Matches, IsDateString
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener mínimo 3 caracteres' })
  @MaxLength(50, { message: 'El nombre debe tener máximo 50 caracteres' })
  name: string;

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
  @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe tener exactamente 10 dígitos numéricos' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'La dirección debe tener máximo 100 caracteres' })
  address?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
  birthdate?: string;

  @IsOptional()
  @IsString()
  role?: string;
}