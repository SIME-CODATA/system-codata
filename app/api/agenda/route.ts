import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/core/security/session'
import { AgendaRepo } from '@/modules/agenda/infra/repo'
import { createEvent } from '@/modules/agenda/application/create'

export async function POST(request: NextRequest) {
  const session = getSession(request)

  if (!session) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const repo = new AgendaRepo()

    const event = await createEvent(repo, {
      title: body.title,
      description: body.description || '',
      type: body.type,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      projectId: body.projectId,
      taskId: body.taskId,
      participantIds: body.participantIds,
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Falha ao criar evento.' },
      { status: 400 }
    )
  }
}