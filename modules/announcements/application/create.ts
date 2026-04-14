import type { CreateAnnouncementInput } from '@/modules/announcements/domain/announcement'
import { AnnouncementRepo } from '@/modules/announcements/infra/repo'

export async function createAnnouncement(repo: AnnouncementRepo, input: CreateAnnouncementInput) {
  const title = input.title.trim()
  const content = input.content.trim()

  if (!title) throw new Error('Título do aviso é obrigatório.')
  if (!content) throw new Error('Conteúdo do aviso é obrigatório.')

  // Ajusta a data para o último segundo do dia escolhido
  let finalExpiresAt = null
  if (input.expiresAt) {
    const date = new Date(input.expiresAt)
    date.setUTCHours(0, 0, 0, 0) 
    finalExpiresAt = date
  }

  return repo.create({
    title,
    content,
    isUrgent: input.isUrgent,
    expiresAt: finalExpiresAt,
    publishedBy: input.publishedBy,
    targetUserIds: input.targetUserIds || [],
  })
}