import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/core/security/session'
import { UserRepo } from '@/modules/users/infra/repo'

export async function PUT(request: NextRequest) {
  const session = getSession(request)

  if (!session) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const repo = new UserRepo()
    
    // Atualiza apenas o campo do calendário do usuário logado
    const updated = await repo.update(session.userId, {
      externalCalendarUrl: body.externalCalendarUrl || null,
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao atualizar perfil.' },
      { status: 400 }
    )
  }
}