import { listProjects } from '@/modules/projects/application/list'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'
import { ProjectTable } from '@/modules/projects/ui/table'

export default async function ProjectsPage() {
  const projectRepo = new ProjectRepo()
  const userRepo = new UserRepo()
  const projects = await listProjects(projectRepo, userRepo)

  return <ProjectTable projects={projects} />
}