import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/core/security/session'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { getTask } from '@/modules/tasks/application/get'
import { updateTask } from '@/modules/tasks/application/update'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

function canEditTask(role: string) {
  return role === 'operador' || role === 'adminGeral' || role === 'superAdmin'
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = getSession(request)

  if (!session) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const taskRepo = new TaskRepo()
    const task = await getTask(taskRepo, id)

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Falha ao buscar tarefa.',
      },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = getSession(request)

  if (!session) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  if (!canEditTask(session.role)) {
    return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id } = await context.params

    const taskRepo = new TaskRepo()
    const projectRepo = new ProjectRepo()
    const userRepo = new UserRepo()

    const task = await updateTask(taskRepo, projectRepo, userRepo, id, {
      title: body.title,
      description: body.description,
      projectId: body.projectId,
      assigneeId: body.assigneeId,
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate,
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Falha ao atualizar tarefa.',
      },
      { status: 400 }
    )
  }
}