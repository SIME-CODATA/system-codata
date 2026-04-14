import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/core/security/session'
import { AnnouncementRepo } from '@/modules/announcements/infra/repo'
import { createAnnouncement } from '@/modules/announcements/application/create'

function canPublishGlobal(role: string) {
  return role === 'adminGeral' || role === 'superAdmin'
}

export async function POST(request: NextRequest) {
  const session = getSession(request)
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const body = await request.json()
    const targetUserIds = body.targetUserIds || []
    const isAdmin = canPublishGlobal(session.role)
    const isPersonalReminder = targetUserIds.length === 1 && targetUserIds[0] === session.userId

    if (!isAdmin && !isPersonalReminder) {
      return NextResponse.json({ error: 'Você só tem permissão para criar lembretes pessoais.' }, { status: 403 })
    }

    const repo = new AnnouncementRepo()
    const aviso = await createAnnouncement(repo, {
      title: body.title,
      content: body.content,
      isUrgent: body.isUrgent,
      expiresAt: body.expiresAt,
      publishedBy: session.userId,
      targetUserIds: isAdmin ? targetUserIds : [session.userId],
    })

    return NextResponse.json(aviso, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao publicar aviso.' }, { status: 400 })
  }
}