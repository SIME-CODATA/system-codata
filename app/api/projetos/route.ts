import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/core/security/session'
import { listProjects } from '@/modules/projects/application/list'
import { createProject } from '@/modules/projects/application/create'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

function canCreateProject(role: string) {
  return role === 'adminGeral' || role === 'superAdmin'
}

export async function GET(request: NextRequest) {
  const session = getSession(request)

  if (!session) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const projectRepo = new ProjectRepo()
  const userRepo = new UserRepo()

  const projects = await listProjects(projectRepo, userRepo)

  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const session = getSession(request)

  if (!session) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  if (!canCreateProject(session.role)) {
    return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 })
  }

  try {
    const body = await request.json()

    const repo = new ProjectRepo()
    const project = await createProject(repo, {
      name: body.name,
      description: body.description,
      status: body.status,
      priority: body.priority,
      ownerId: body.ownerId,
      memberIds: body.memberIds,
      progress: body.progress,
      startDate: body.startDate,
      dueDate: body.dueDate,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Falha ao criar projeto.',
      },
      { status: 400 }
    )
  }
}