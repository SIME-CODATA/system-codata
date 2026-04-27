import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/core/security/cookie'

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  return response
}