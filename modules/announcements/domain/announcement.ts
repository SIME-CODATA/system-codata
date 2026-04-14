export type Announcement = {
  id: string
  title: string
  content: string
  isUrgent: boolean
  expiresAt: Date | null
  publishedBy: string 
  targetUserIds: string[] 
  createdAt: Date
  updatedAt: Date
}

export type CreateAnnouncementInput = {
  title: string
  content: string
  isUrgent: boolean
  expiresAt?: string | null
  publishedBy: string
  targetUserIds?: string[]
}