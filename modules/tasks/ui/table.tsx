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
}

type Props = {
  tasks: TaskRow[]
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
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <strong>{task.title}</strong>
                <div>{task.description}</div>
              </td>
              <td>{task.projectName}</td>
              <td>{task.assigneeName}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
              <td>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('pt-BR')
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}