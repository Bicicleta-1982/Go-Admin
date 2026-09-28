'use server';

import { redirect } from 'next/navigation';
import { createServerClientForRequest } from '@/lib/supabase/server';

export type AppRole = 'admin' | 'finanzas' | 'ventas' | 'lectura';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  const supabase = await createServerClientForRequest();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createServerClientForRequest();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  redirect('/login');
}

export async function resetPassword(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const supabase = await createServerClientForRequest();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/login`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
