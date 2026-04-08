import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/modules/auth/application/sign-in'
import { UserRepo } from '@/modules/users/infra/repo'
import { setSessionCookie } from '@/core/security/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const repo = new UserRepo()
    const result = await signIn(repo, {
      email: body.email ?? '',
      password: body.password ?? '',
    })

    const response = NextResponse.json({ user: result.user })
    setSessionCookie(response, result.token)

    return response
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Falha no login.' },
      { status: 401 }
    )
  }
}