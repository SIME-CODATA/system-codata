import Link from 'next/link'

type DashboardTaskItem = {
  id: string
  title: string
  projectName: string
  assigneeName: string
  dueDate: Date | null
  status: string
  priority: string
}

type Props = {
  overdueTasks: DashboardTaskItem[]
  recentTasks: DashboardTaskItem[]
}

function TaskList({
  title,
  items,
  emptyMessage,
  highlightOverdue,
}: {
  title: string
  items: DashboardTaskItem[]
  emptyMessage: string
  highlightOverdue?: boolean
}) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#ffffff',
      }}
    >
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      {items.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((task) => (
            <div
              key={task.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 12,
                backgroundColor: highlightOverdue ? '#fff1f2' : '#f9fafb',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <strong>{task.title}</strong>
                <Link href={`/tarefas/${task.id}`}>Editar</Link>
              </div>

              <div style={{ marginTop: 6 }}>
                <div>Projeto: {task.projectName}</div>
                <div>Responsável: {task.assigneeName}</div>
                <div>Status: {task.status}</div>
                <div>Prioridade: {task.priority}</div>
                <div>
                  Prazo:{' '}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString('pt-BR')
                    : '-'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function DashboardLists({ overdueTasks, recentTasks }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 16,
        marginTop: 24,
      }}
    >
      <TaskList
        title="Tarefas atrasadas"
        items={overdueTasks}
        emptyMessage="Nenhuma tarefa atrasada."
        highlightOverdue
      />

      <TaskList
        title="Tarefas recentes"
        items={recentTasks}
        emptyMessage="Nenhuma tarefa cadastrada ainda."
      />
    </div>
  )
}