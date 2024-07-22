import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { get } from '@vercel/edge-config';

// Closure
let createdMap:Map<string,string>|null = null;

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const response = NextResponse.next();
  if (url.pathname === '/') {
    const countries: readonly string[] = await get('countries') || [];
    const requestHeaders = new Headers(request.headers);
    const country = requestHeaders.get('X-Vercel-IP-Country') || '';
    if (countries.some(co => (co.toUpperCase() == country.toUpperCase()))) {
      return NextResponse.rewrite(new URL(`/${country}/`, request.url));
    }
  }

  // assuming /permanent is a 308 redirect type
  if(url.pathname.startsWith('/permanent')) {
    return NextResponse.redirect(new URL(`/blog/1`, request.url), 308);
  }

  if (url.pathname.startsWith('/blog')) {
    const requestHeaders = new Headers(request.headers);
    let headers: { [key: string]: string } = {};
    requestHeaders.forEach((value, key) => {
      headers[`${key}`] = value;
    });
    // Print headers and url
    //console.log('#######', headers, request.nextUrl.host, request.nextUrl.pathname);

    const longUrls: readonly any[] = await get('longUrls') || [];
    if (!createdMap) {
      createdMap = new Map(longUrls.map(obj => [obj.u, obj.h]));
    }
    const slug = url.pathname.replace('/blog/', '');
    // if the long URL is found
    if (createdMap.has(slug)) {
      return NextResponse.rewrite(new URL(`/blog/${createdMap.get(slug)}/`, request.url));
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
    '\/',
    '\/permanent',
    //only runs on blog slugs longer than 30
    // `\/blog/(.........................+)`,
    // '/((?!api|_next/static/.*|_next/image/.*|favicon.ico|blog/....))',
    `\/blog/(.+)`,
    '/((?!api|_next/static/.*|_next/image/.*|favicon.ico))',
  ],
}

