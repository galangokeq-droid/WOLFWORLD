import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Hanya publishable key yang boleh berada di frontend.
// service_role tidak boleh pernah dimasukkan ke kode ini.
const SUPABASE_URL = 'https://trzezaqayiollrchnswl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Mmd6qPBB-yRKk_OxTfhwxw_wjBSaikB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
