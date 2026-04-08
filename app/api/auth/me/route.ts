import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/core/security/session'
import { getCurrentUser } from '@/modules/auth/application/me'
import { UserRepo } from '@/modules/users/infra/repo'

export async function GET(request: NextRequest) {
  const session = getSession(request)

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const repo = new UserRepo()
  const user = await getCurrentUser(repo, session)

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({ user })
}