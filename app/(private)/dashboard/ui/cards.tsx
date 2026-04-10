type Summary = {
  totalProjects: number
  totalTasks: number
  pendingTasks: number
  inProgressTasks: number
  completedTasks: number
  overdueTasks: number
}

type Props = {
  summary: Summary
}

function Card({
  title,
  value,
  highlight,
}: {
  title: string
  value: number
  highlight?: boolean
}) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        backgroundColor: highlight ? '#fff1f2' : '#ffffff',
      }}
    >
      <p style={{ margin: 0, fontSize: 14 }}>{title}</p>
      <h2 style={{ margin: '8px 0 0', fontSize: 28 }}>{value}</h2>
    </div>
  )
}

export function DashboardCards({ summary }: Props) {
  return (
    <div>
      <h1>Dashboard</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
        <Card title="Projetos" value={summary.totalProjects} />
        <Card title="Tarefas" value={summary.totalTasks} />
        <Card title="Pendentes" value={summary.pendingTasks} />
        <Card title="Em andamento" value={summary.inProgressTasks} />
        <Card title="Concluídas" value={summary.completedTasks} />
        <Card title="Atrasadas" value={summary.overdueTasks} highlight />
      </div>
    </div>
  )
}