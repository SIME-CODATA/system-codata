type Summary = {
  totalProjects: number
  totalTasks: number
  pendingTasks: number
  inProgressTasks: number
  completedTasks: number
  overdueTasks: number
}

function Card({ title, value, highlight, icon }: { title: string; value: number; highlight?: boolean; icon: string }) {
  return (
    <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-sm ${
      highlight 
        ? 'bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-400' 
        : 'bg-surface border-black/5 dark:border-white/5 text-foreground'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <p className={`text-sm font-bold uppercase tracking-wider ${highlight ? 'text-red-500/70' : 'text-muted'}`}>
          {title}
        </p>
        <i className={`${icon} text-xl ${highlight ? 'text-red-500/50' : 'text-primary/50'}`}></i>
      </div>
      <h2 className="text-4xl font-bold mt-2">{value}</h2>
      
      {/* Detalhe de design no fundo do card */}
      <div className={`absolute -bottom-4 -right-4 text-7xl opacity-5 ${highlight ? 'text-red-500' : 'text-primary'}`}>
        <i className={icon}></i>
      </div>
    </div>
  )
}

export function DashboardCards({ summary }: { summary: Summary }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <Card title="Projetos" value={summary.totalProjects} icon="fa-solid fa-folder" />
      <Card title="Tarefas" value={summary.totalTasks} icon="fa-solid fa-list-check" />
      <Card title="Pendentes" value={summary.pendingTasks} icon="fa-solid fa-clock" />
      <Card title="Em andamento" value={summary.inProgressTasks} icon="fa-solid fa-spinner" />
      <Card title="Concluídas" value={summary.completedTasks} icon="fa-solid fa-check-double" />
      <Card title="Atrasadas" value={summary.overdueTasks} icon="fa-solid fa-triangle-exclamation" highlight />
    </div>
  )
}