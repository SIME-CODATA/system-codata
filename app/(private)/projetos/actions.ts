'use server'
import { revalidatePath } from 'next/cache'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/core/security/cookie'
import { readSessionToken } from '@/core/security/session'
import type { ProjectPriority, ProjectStatus } from '@/modules/projects/domain/project'

type Session = {
    id?: string
    sub?: string
    userId?: string
    role?: string
}

async function getUserId() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value
  const session = readSessionToken(sessionValue) as Session
  return session?.id || session?.sub || session?.userId || '507f1f77bcf86cd799439011'
}

export async function createProject(formData: FormData) {
  const userId = await getUserId()
  const projectRepo = new ProjectRepo()

  try {
    await projectRepo.create({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: 'naoIniciado',
      priority: (formData.get('priority') as ProjectPriority) || 'media',
      ownerId: userId,
      memberIds: [formData.get('assignedTo') as string || userId], 
      progress: 0,
      startDate: new Date(),
      dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null,
    })

    revalidatePath('/projetos')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Falha ao criar o projeto.' }
  }
}

export async function updateProject(id: string, formData: FormData) {
  const projectRepo = new ProjectRepo()

  try {
    const assignedUserId = formData.get('assignedTo') as string
    const dueDate = formData.get('dueDate') as string
    await projectRepo.update(id, {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as ProjectPriority,
      memberIds: assignedUserId ? [assignedUserId] : undefined,
      dueDate: dueDate ? new Date(dueDate) : null,
    })
    revalidatePath('/projetos')
    return { success: true }
    
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error)
    return { success: false, error: 'Falha ao tentar atualizar o projeto no banco de dados.' }
  }
}

export async function deleteProject(id: string) {
  const projectRepo = new ProjectRepo()

  try {
    console.log("Deletando projeto", id)
    
    revalidatePath('/projetos')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Falha ao excluir o projeto.' }
  }
}