import { supabase } from '../config/supabase.js';

export const APP_ROLES = Object.freeze({
  OWNER: 'owner',
  ADMIN: 'admin',
});

/**
 * Menentukan panel yang boleh diakses dari profil.
 * Keputusan akhir tetap ada di RLS database; ini hanya untuk routing UI.
 */
export function resolveAccess(profile) {
  if (!profile) {
    return { allowed: false, reason: 'PROFILE_MISSING' };
  }
  if (!profile.isActive) {
    return { allowed: false, reason: 'ACCOUNT_INACTIVE' };
  }
  if (profile.roleSlug === APP_ROLES.OWNER || profile.roleSlug === APP_ROLES.ADMIN) {
    return { allowed: true, role: profile.roleSlug };
  }
  return { allowed: false, reason: 'UNKNOWN_ROLE' };
}

/** Memeriksa izin ke database lewat fungsi has_permission (RLS-aware). */
export async function hasPermission(slug) {
  const { data, error } = await supabase.rpc('has_permission', { p_slug: slug });
  if (error) throw error;
  return data === true;
}
