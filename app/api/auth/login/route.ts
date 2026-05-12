import { NextResponse } from 'next/server'
import { UserRepo } from '@/modules/users/infra/repo'
import { signIn } from '@/modules/auth/application/sign-in'
import { setSessionCookie } from '@/core/security/session'
import { connectMongo } from '@/core/database/mongo'

export async function POST(request: Request) {
  try {
    await connectMongo()
    const body = await request.json()
    const repo = new UserRepo()
    const result = await signIn(repo, body)
    await setSessionCookie(result.token)
    return NextResponse.json({ success: true, user: result.user })

  } catch (error: unknown | any) {
    console.error("Erro no login:", error)
    return NextResponse.json(
      { error: error.message || 'Falha no login. Verifique as credenciais.' }, 
      { status: 401 }
    )
  }
}