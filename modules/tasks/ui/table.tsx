import Link from 'next/link'

type TaskRow = {
  id: string
  title: string
  description: string
  projectId: string
  projectName: string
  assigneeId: string
  assigneeName: string
  status: string
  priority: string
  dueDate: Date | null
  createdAt: Date
  isOverdue: boolean
}

type Props = {
  tasks: TaskRow[]
}

function getStatusLabel(status: string, isOverdue: boolean) {
  if (isOverdue) return 'Atrasada'

  switch (status) {
    case 'pendente':
      return 'Pendente'
    case 'emAndamento':
      return 'Em andamento'
    case 'concluida':
      return 'Concluída'
    case 'bloqueada':
      return 'Bloqueada'
    case 'cancelada':
      return 'Cancelada'
    default:
      return status
  }
}

export function TaskTable({ tasks }: Props) {
  return (
    <div>
      <h1>Tarefas</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Título</th>
            <th align="left">Projeto</th>
            <th align="left">Responsável</th>
            <th align="left">Status</th>
            <th align="left">Prioridade</th>
            <th align="left">Prazo</th>
            <th align="left">Ações</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              style={
                task.isOverdue
                  ? { backgroundColor: '#fff1f2' }
                  : undefined
              }
            >
              <td>
                <strong>{task.title}</strong>
                <div>{task.description}</div>
              </td>
              <td>{task.projectName}</td>
              <td>{task.assigneeName}</td>
              <td>
                <span
                  style={
                    task.isOverdue
                      ? {
                          color: '#b91c1c',
                          fontWeight: 700,
                        }
                      : undefined
                  }
                >
                  {getStatusLabel(task.status, task.isOverdue)}
                </span>
              </td>
              <td>{task.priority}</td>
              <td>
                <span
                  style={
                    task.isOverdue
                      ? {
                          color: '#b91c1c',
                          fontWeight: 700,
                        }
                      : undefined
                  }
                >
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString('pt-BR')
                    : '-'}
                </span>
              </td>
              <td>
                <Link href={`/tarefas/${task.id}`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}