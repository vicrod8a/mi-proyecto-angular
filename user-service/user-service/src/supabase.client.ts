import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lmtfermgcsqwalzrqhqt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
	throw new Error('SUPABASE_KEY no está definida. Configure SUPABASE_KEY en las variables de entorno del servidor y NUNCA exponga la service_role key en el frontend ni en el repositorio.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
