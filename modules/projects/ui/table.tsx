type ProjectRow = {
  id: string
  name: string
  description: string
  status: string
  priority: string
  ownerId: string
  ownerName: string
  memberIds: string[]
  progress: number
  startDate: Date | null
  dueDate: Date | null
  createdAt: Date
}

type Props = {
  projects: ProjectRow[]
}

export function ProjectTable({ projects }: Props) {
  return (
    <div>
      <h1>Projetos</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Nome</th>
            <th align="left">Status</th>
            <th align="left">Prioridade</th>
            <th align="left">Progresso</th>
            <th align="left">Responsável</th>
            <th align="left">Prazo</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>
                <strong>{project.name}</strong>
                <div>{project.description}</div>
              </td>
              <td>{project.status}</td>
              <td>{project.priority}</td>
              <td>{project.progress}%</td>
              <td>{project.ownerName}</td>
              <td>
                {project.dueDate
                  ? new Date(project.dueDate).toLocaleDateString('pt-BR')
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}