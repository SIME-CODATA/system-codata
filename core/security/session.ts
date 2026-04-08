import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/core/config/env'
import { SESSION_COOKIE, SESSION_MAX_AGE } from './cookie'
import type { UserRole } from '@/modules/users/domain/user'

export type SessionData = {
  userId: string
  role: UserRole
  exp: number
}

function sign(value: string) {
  return createHmac('sha256', env.sessionSecret)
    .update(value)
    .digest('base64url')
}

export function createSessionToken(userId: string, role: UserRole) {
  const payload: SessionData = {
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  }

  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = sign(encoded)

  return `${encoded}.${signature}`
}

export function readSessionToken(token?: string | null): SessionData | null {
  if (!token) return null

  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null

  const expected = sign(encoded)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)

  if (a.length !== b.length) return null
  if (!timingSafeEqual(a, b)) return null

  const payload = JSON.parse(
    Buffer.from(encoded, 'base64url').toString('utf-8')
  ) as SessionData

  if (payload.exp < Math.floor(Date.now() / 1000)) return null

  return payload
}

export function getSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  return readSessionToken(token)
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}