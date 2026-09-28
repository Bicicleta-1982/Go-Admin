import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/forgot-password'];
const protectedRoutes = ['/dashboard'];
const roleRoutes: Record<string, string[]> = {
  admin: ['/dashboard', '/dashboard/usuarios', '/dashboard/auditoria'],
  finanzas: ['/dashboard', '/dashboard/parametros'],
  ventas: ['/dashboard', '/dashboard/clientes'],
  lectura: ['/dashboard'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isProtected = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!user || error) {
    return response;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const userRole = profile?.role ?? 'lectura';

  if (isProtected) {
    const allowed = roleRoutes[userRole] ?? ['/dashboard'];
    const matchesAllowed = allowed.some((route) => pathname === route || pathname.startsWith(`${route}/`));

    if (!matchesAllowed) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (profileError && userRole === 'lectura' && isProtected) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
