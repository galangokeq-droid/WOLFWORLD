import { supabase } from '../config/supabase.js';

/**
 * Mengambil profil user yang sedang login beserta slug role-nya.
 * Role dibaca dari tabel roles lewat role_id, bukan dari string di profiles.
 * Mengembalikan null jika profil tidak ada.
 */
export async function fetchCurrentProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, is_active, roles ( slug )')
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    isActive: data.is_active,
    roleSlug: data.roles?.slug ?? null,
  };
}
