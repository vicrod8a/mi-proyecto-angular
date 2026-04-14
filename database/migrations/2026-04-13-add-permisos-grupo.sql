-- Add permisos_grupo table: stores per-user, per-group permissions
CREATE TABLE IF NOT EXISTS public.permisos_grupo (
  id serial PRIMARY KEY,
  group_id integer NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  permission character varying NOT NULL,
  granted_at timestamp with time zone DEFAULT now(),
  granted_by integer,
  UNIQUE (group_id, user_id, permission)
);
CREATE INDEX IF NOT EXISTS idx_permisos_grupo_group_user ON public.permisos_grupo(group_id, user_id);
