import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/core/security/session'
import { AnnouncementRepo } from '@/modules/announcements/infra/repo'
import { updateAnnouncement } from '@/modules/announcements/application/update'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = getSession(request)
  if (!session || (session.role !== 'adminGeral' && session.role !== 'superAdmin')) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  // O Next.js agora exige que os parâmetros da URL sejam "desempacotados" com await
  const { id } = await context.params

  const repo = new AnnouncementRepo()
  await repo.delete(id)

  return new NextResponse(null, { status: 204 })
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = getSession(request)
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await context.params
  const body = await request.json()
  const isAdmin = session.role === 'adminGeral' || session.role === 'superAdmin'

  const repo = new AnnouncementRepo()
  
  // Bloqueio de segurança: se não for admin, só pode editar se o aviso for um lembrete dele mesmo
  if (!isAdmin) {
    const aviso = await repo.findById(id)
    if (!aviso || aviso.publishedBy !== session.userId) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }
  }

  try {
    const updated = await updateAnnouncement(repo, id, {
      title: body.title,
      content: body.content,
      isUrgent: body.isUrgent,
      expiresAt: body.expiresAt,
      // Se não for admin, trava o destinatário para ele mesmo
      targetUserIds: isAdmin ? body.targetUserIds : [session.userId], 
    })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao atualizar' }, { status: 400 })
  }
}