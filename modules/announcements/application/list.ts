import { AnnouncementRepo } from '@/modules/announcements/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

export async function listAnnouncements(
  announcementRepo: AnnouncementRepo,
  userRepo: UserRepo,
  currentUserId: string,
  isAdmin: boolean = false
) {
  const [announcements, users] = await Promise.all([
    announcementRepo.listActive(currentUserId, isAdmin), 
    userRepo.list(),
  ])

  const usersMap = new Map(users.map((u) => [u.id, u.name]))

  return announcements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    isUrgent: a.isUrgent,
    expiresAt: a.expiresAt,
    publisherName: usersMap.get(a.publishedBy) ?? 'Administração',
    createdAt: a.createdAt,
  }))
}