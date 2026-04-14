import { AnnouncementRepo } from '@/modules/announcements/infra/repo'

export async function updateAnnouncement(repo: AnnouncementRepo, id: string, input: any) {
  const title = input.title?.trim()
  const content = input.content?.trim()

  if (!title || !content) throw new Error('Título e conteúdo são obrigatórios.')

  let finalExpiresAt = null
  if (input.expiresAt) {
    const date = new Date(input.expiresAt)
    date.setUTCHours(0, 0, 0, 0)
    finalExpiresAt = date
  }

  return repo.update(id, {
    title,
    content,
    isUrgent: input.isUrgent,
    expiresAt: finalExpiresAt,
    targetUserIds: input.targetUserIds || [],
  })
}