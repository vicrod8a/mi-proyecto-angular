import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { supabase } from '../supabase.client';

@Injectable()
export class UsersService {

  private async formatUser(user: any) {
    // Permisos globales
    let permisosGlobales: string[] = [];
    if (user.permisos_globales?.length) {
      const { data: perms } = await supabase
        .from('permisos')
        .select('nombre')
        .in('id', user.permisos_globales);
      permisosGlobales = perms?.map((p: any) => p.nombre) || [];
    }

    // Permisos de grupo
    const { data: grupoPerm } = await supabase
      .from('grupo_usuario_permisos')
      .select('permiso_id, permisos(nombre)')
      .eq('usuario_id', user.id);

    const permisosGrupo = grupoPerm
      ?.map((gp: any) => gp.permisos?.nombre)
      .filter(Boolean) || [];

    // Combinar globales + grupo sin duplicados
    const permissions = [...new Set([...permisosGlobales, ...permisosGrupo])];

    // Grupos del usuario
    const { data: grupos } = await supabase
      .from('grupo_miembros')
      .select('grupo_id')
      .eq('usuario_id', user.id);
    const groupIds = grupos?.map((g: any) => g.grupo_id) || [];

    return {
      id:        user.id,
      name:      user.username,
      email:     user.email,
      role:      user.rol,
      permissions,
      groupIds,
      phone:     user.telefono        || '',
      address:   user.direccion       || '',
      birthdate: user.fecha_inicio    || '',
      fullName:  user.nombre_completo || '',
    };
  }

  async getAll() {
    const { data, error } = await supabase
      .from('usuarios').select('*').order('creado_en');
    if (error) throw error;
    return Promise.all(data.map(u => this.formatUser(u)));
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('usuarios').select('*').eq('id', id).single();
    if (error) throw new NotFoundException('Usuario no encontrado');
    return this.formatUser(data);
  }

  async getMe(userId: string) {
    return this.getById(userId);
  }

  async getPermissions(userId: string) {
    const { data: user } = await supabase
      .from('usuarios').select('permisos_globales, rol').eq('id', userId).single();

    const permisos: any[] = [];

    if (user?.permisos_globales?.length) {
      const { data: globales } = await supabase
        .from('permisos').select('*').in('id', user.permisos_globales);
      globales?.forEach(p => permisos.push({
        permiso_id: p.id, nombre: p.nombre,
        scope: p.scope, grupo_id: null, grupo_nombre: null
      }));
    }

    const { data: grupoPerm } = await supabase
      .from('grupo_usuario_permisos')
      .select('permiso_id, grupo_id, permisos(nombre, scope), grupos(nombre)')
      .eq('usuario_id', userId);

    grupoPerm?.forEach((gp: any) => permisos.push({
      permiso_id:   gp.permiso_id,
      nombre:       gp.permisos?.nombre,
      scope:        gp.permisos?.scope,
      grupo_id:     gp.grupo_id,
      grupo_nombre: gp.grupos?.nombre,
    }));

    return permisos;
  }

  async create(body: any) {
    const hash = body.password
      ? await bcrypt.hash(body.password, 10)
      : await bcrypt.hash('changeme', 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        username:          body.name,
        email:             body.email,
        nombre_completo:   body.name,
        rol:               body.role || 'user',
        password_hash:     hash,
        permisos_globales: [],
      })
      .select().single();

    if (error) throw error;
    return this.formatUser(data);
  }

  async update(id: string, body: any) {
    const updateData: any = {
      username:     body.name,
      email:        body.email,
      rol:          body.role,
      telefono:     body.phone     || null,
      direccion:    body.address   || null,
      fecha_inicio: body.birthdate || null,
    };
    if (body.password) {
      updateData.password_hash = await bcrypt.hash(body.password, 10);
    }

    const { data, error } = await supabase
      .from('usuarios').update(updateData).eq('id', id)
      .select().single();
    if (error) throw error;
    return this.formatUser(data);
  }

  async delete(id: string) {
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) throw error;
    return { message: 'Usuario eliminado' };
  }

  async setPermissions(userId: string, permissions: string[]) {
    let ids: string[] = [];

    if (permissions.length) {
      const { data: perms, error } = await supabase
        .from('permisos').select('id, nombre').in('nombre', permissions);
      if (error) throw error;
      ids = perms?.map((p: any) => p.id) || [];
    }

    const { error } = await supabase
      .from('usuarios')
      .update({ permisos_globales: ids })
      .eq('id', userId);

    if (error) throw error;
    return { message: 'Permisos actualizados' };
  }
}