import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/core/security/session'
import { listTasks } from '@/modules/tasks/application/list'
import { createTask } from '@/modules/tasks/application/create'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

function canCreateTask(role: string) {
  return role === 'operador' || role === 'adminGeral' || role === 'superAdmin'
}

export async function GET(request: NextRequest) {
  const session = getSession(request)

  if (!session) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const taskRepo = new TaskRepo()
  const projectRepo = new ProjectRepo()
  const userRepo = new UserRepo()

  const tasks = await listTasks(taskRepo, projectRepo, userRepo)

  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  const session = getSession(request)

  if (!session) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  if (!canCreateTask(session.role)) {
    return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 })
  }

  try {
    const body = await request.json()

    const taskRepo = new TaskRepo()
    const projectRepo = new ProjectRepo()
    const userRepo = new UserRepo()

    const task = await createTask(taskRepo, projectRepo, userRepo, {
      title: body.title,
      description: body.description,
      projectId: body.projectId,
      assigneeId: body.assigneeId,
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate,
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Falha ao criar tarefa.',
      },
      { status: 400 }
    )
  }
}