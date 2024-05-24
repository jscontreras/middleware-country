import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { get } from '@vercel/edge-config';


export async function middleware(request: NextRequest) {
  const countries: readonly string[] = await get('countries') || [];
  const url = request.nextUrl;
  const response = NextResponse.next();

  if (url.pathname === '/') {
    const requestHeaders = new Headers(request.headers);
    const country = requestHeaders.get('X-Vercel-IP-Country') || '';
    console.log('country', country)
    if (countries.some( co => (co.toUpperCase() == country.toUpperCase()))) {
      return NextResponse.rewrite(new URL(`/${country}/`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '\/'
  ],
}