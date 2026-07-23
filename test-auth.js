const { createServerClient } = require('@supabase/ssr');

// Read token from env
const token = process.env.TEST_TOKEN;
const refresh = process.env.TEST_REFRESH;

const cookies = {
  getAll: () => [
    { 
      name: 'sb-localhost-auth-token', 
      value: JSON.stringify({ 
        access_token: token, 
        refresh_token: refresh, 
        expires_in: 3600, 
        expires_at: Math.floor(Date.now()/1000) + 3600, 
        token_type: 'bearer' 
      }) 
    }
  ],
  setAll: (toSet) => { console.log('setAll called:', toSet.map(c => c.name)); }
};

async function main() {
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  const supabase = createServerClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies }
  );
  
  const { data, error } = await supabase.auth.getUser();
  console.log('getUser result:', JSON.stringify({ user: data?.user?.email, error: error?.message }));
}

main().catch(e => console.error('ERROR:', e));
