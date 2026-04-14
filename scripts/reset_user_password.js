const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function main() {
  const [email, newPassword] = process.argv.slice(2);
  if (!email || !newPassword) {
    console.error('Usage: node reset_user_password.js <email> <newPassword>');
    process.exit(1);
  }

  // Try to read SUPABASE config from user-service .env for convenience
  const envPath = path.resolve(__dirname, '..', 'user-service', 'user-service', '.env');
  let SUPABASE_URL = process.env.SUPABASE_URL;
  let SUPABASE_KEY = process.env.SUPABASE_KEY;
  try {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split(/\r?\n/)) {
        const m = line.match(/^(SUPABASE_URL|SUPABASE_KEY)=(.*)$/);
        if (m) {
          if (m[1] === 'SUPABASE_URL') SUPABASE_URL = m[2].trim();
          if (m[1] === 'SUPABASE_KEY') SUPABASE_KEY = m[2].trim();
        }
      }
    }
  } catch (e) {
    // ignore
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('SUPABASE_URL or SUPABASE_KEY not found in env or user-service .env');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    const { data: users, error } = await supabase.from('users').select('id').eq('email', email).limit(1);
    if (error) {
      console.error('Supabase query error:', error);
      process.exit(1);
    }
    if (!users || users.length === 0) {
      console.error('User not found for email', email);
      process.exit(1);
    }
    const id = users[0].id;
    const hash = await bcrypt.hash(newPassword, 10);
    const { error: upErr } = await supabase.from('users').update({ password_hash: hash }).eq('id', id);
    if (upErr) {
      console.error('Update error:', upErr);
      process.exit(1);
    }
    console.log('Password hash updated for', email);
    process.exit(0);
  } catch (e) {
    console.error('Unexpected error:', e);
    process.exit(1);
  }
}

main();
