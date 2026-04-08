import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { supabase } from '../supabase.client';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async login(email: string, password: string) {
    // Buscar usuario por email o username
    const { data: users, error } = await supabase
      .from('usuarios')
      .select('*')
      .or(`email.eq.${email},username.eq.${email}`)
      .limit(1);

    if (error || !users?.length) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const user = users[0];
    const passwordOk = await bcrypt.compare(password, user.password_hash);

    if (!passwordOk) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Obtener permisos globales del usuario
    let permissions: string[] = [];
    if (user.permisos_globales?.length) {
      const { data: perms } = await supabase
        .from('permisos')
        .select('nombre')
        .in('id', user.permisos_globales);
      permissions = perms?.map((p: any) => p.nombre) || [];
    }

    // Obtener grupos del usuario
    const { data: grupos } = await supabase
      .from('grupo_miembros')
      .select('grupo_id')
      .eq('usuario_id', user.id);
    const groupIds = grupos?.map((g: any) => g.grupo_id) || [];

    // Actualizar last_login
    await supabase
      .from('usuarios')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    const payload = { sub: user.id, email: user.email, role: user.rol };
    const token = this.jwt.sign(payload);

    return {
      token,
      message: 'Login exitoso',
      usuario: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.rol,
        permissions,
        groupIds,
      },
    };
  }

  async register(body: {
    username: string; email: string; fullName: string;
    address: string; phone: string; birthdate: string; password: string;
  }) {
    
    const { data: existing } = await supabase
      .from('usuarios')
      .select('id')
      .or(`email.eq.${body.email},username.eq.${body.username}`)
      .limit(1);

    if (existing?.length) {
      throw new ConflictException('El usuario o correo ya existe');
    }

    const hash = await bcrypt.hash(body.password, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        username: body.username,
        email: body.email,
        nombre_completo: body.fullName,
        direccion: body.address,
        telefono: body.phone,
        fecha_inicio: body.birthdate,
        password_hash: hash,
        rol: 'user',
        permisos_globales: [],
      })
      .select()
      .single();

    if (error) throw new ConflictException('Error al crear usuario');

    return { message: 'Usuario creado correctamente', id: data.id };
  }

  async logout() {
    return { message: 'Sesión cerrada' };
  }
}
