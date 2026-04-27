import { NextRequest, NextResponse } from 'next/server'
import { verifyFeedToken } from '@/core/security/feed-token'
import { exportAgendaToICS } from '@/modules/agenda/application/export'
import { AgendaRepo } from '@/modules/agenda/infra/repo'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { TaskRepo } from '@/modules/tasks/infra/repo'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return new NextResponse('Acesso negado: Token ausente', { status: 401 })
  }

  const userId = verifyFeedToken(token)
  if (!userId) {
    return new NextResponse('Acesso negado: Token inválido', { status: 401 })
  }

  const agendaRepo = new AgendaRepo()
  const projectRepo = new ProjectRepo()
  const taskRepo = new TaskRepo()

  try {
    const icsString = await exportAgendaToICS(agendaRepo, projectRepo, taskRepo)

    return new NextResponse(icsString, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="agenda-codata.ics"',
        // Evita que o Google Calendar faça cache de uma versão antiga
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch ( error ) {
    return new NextResponse('Erro interno ao gerar feed', { status: 500 })
  }
}