import { createServerClientForRequest } from '@/lib/supabase/server';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'finanzas' | 'ventas' | 'lectura';
};

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createServerClientForRequest();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !profile) {
    return {
      id: user.id,
      email: user.email ?? 'usuario@sin-email.local',
      full_name: user.email ?? 'Usuario',
      role: 'lectura',
    };
  }

  return {
    id: profile.id,
    email: profile.email ?? user.email ?? 'usuario@sin-email.local',
    full_name: profile.full_name ?? 'Usuario',
    role: (profile.role as UserProfile['role']) ?? 'lectura',
  };
}
