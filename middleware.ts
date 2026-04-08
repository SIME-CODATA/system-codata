import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/core/security/cookie'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = !!request.cookies.get(SESSION_COOKIE)?.value

  const isInternalRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/usuarios') ||
    pathname.startsWith('/projetos')

  const isLoginRoute = pathname.startsWith('/login')

  if (isInternalRoute && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/usuarios/:path*', '/projetos/:path*', '/login'],
}