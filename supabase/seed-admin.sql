-- Seed inicial para crear el primer usuario administrador.
-- Ejecutar usando el cliente SQL de Supabase o en la consola de SQL.
-- Reemplaza los valores de ejemplo antes del primer acceso real.

-- 1) Crear usuario de autenticación en Supabase Auth.
-- Usa la UI de Supabase > Authentication > Users > Add user para crear el usuario con:
-- email: admin@comercialvencedor.cl
-- password: Cambiar123!
-- Luego ejecuta el bloque siguiente para sincronizar el perfil.

insert into public.profiles (id, email, full_name, rut, role, is_active)
values (
  '1d956346-9e09-4fa0-ac84-ba7ae03c6d9a'::uuid,
  'mauricio.venegas@elvencedordeportes.cl',
  'Administrador principal',
  '15491757-8',
  'admin',
  true
)
on conflict (email) do update
set full_name = excluded.full_name,
    rut = excluded.rut,
    role = excluded.role,
    is_active = excluded.is_active,
    updated_at = now();

-- Nota:
-- El id del perfil debe coincidir con el UUID del usuario autenticado en auth.users.
-- Si se crea el usuario desde la UI, reemplaza el valor anterior con el UUID real del usuario.
-- No dejar este valor fijo en producción; es solo un seed de desarrollo inicial.
