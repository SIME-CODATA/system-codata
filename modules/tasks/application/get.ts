import { TaskRepo } from '@/modules/tasks/infra/repo'

export async function getTask(taskRepo: TaskRepo, id: string) {
  const task = await taskRepo.findById(id)

  if (!task) {
    throw new Error('Tarefa não encontrada.')
  }

  return task
}