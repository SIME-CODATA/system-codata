'use server'

import { revalidatePath } from 'next/cache'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/core/security/cookie'
import { readSessionToken } from '@/core/security/session'
import type { TaskPriority } from '@/modules/tasks/domain/task'

async function getUserId() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value
  const session = readSessionToken(sessionValue) as {
    id?: string
    sub?: string
    userId?: string
    role?: string
  }
  return session?.id || session?.sub || session?.userId || '507f1f77bcf86cd799439011'
}

export async function createTask(formData: FormData) {
  const userId = await getUserId()
  const taskRepo = new TaskRepo()

  try {
    await taskRepo.create({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      projectId: formData.get('projectId') as string,
      assigneeId: formData.get('assigneeId') as string || userId,
      status: 'pendente',
      priority: (formData.get('priority') as TaskPriority) || 'media',
      dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null,
      
    })

    // ✨ MÁGICA: Atualizamos as DUAS telas para manter o sistema sincronizado!
    revalidatePath('/tarefas')
    revalidatePath('/projetos') 
    
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar tarefa:', error)
    return { success: false, error: 'Falha ao criar a tarefa.' }
  }
}