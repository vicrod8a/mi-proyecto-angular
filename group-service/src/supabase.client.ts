import { createClient } from '@supabase/supabase-js';

// You can set these via environment variables, or paste your keys below.
// WARNING: Storing keys in source code is insecure. Remove before committing.
const ENV_SUPABASE_URL = process.env.SUPABASE_URL;
const ENV_SUPABASE_KEY = process.env.SUPABASE_KEY;

// --- Paste your Supabase credentials here if you prefer to hardcode them locally ---
// Replace the empty strings with your Supabase project URL and service/public key.
const HARDCODED_SUPABASE_URL = 'https://lmtfermgcsqwalzrqhqt.supabase.co';
const HARDCODED_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdGZlcm1nY3Nxd2FsenJxaHF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQwNjYwOSwiZXhwIjoyMDg5OTgyNjA5fQ.J1yNZbouw6u-ef-pfFS9zcP0bSv0P08HId5svAy9BMs';
// -----------------------------------------------------------------------------------

const SUPABASE_URL = ENV_SUPABASE_URL || HARDCODED_SUPABASE_URL;
const SUPABASE_KEY = ENV_SUPABASE_KEY || HARDCODED_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in environment for group-service (or paste them into supabase.client.ts)');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
