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

function TaskList({ title, items, emptyMessage, highlightOverdue }: { title: string; items: DashboardTaskItem[]; emptyMessage: string; highlightOverdue?: boolean }) {
  return (
    <div className="bg-surface border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-black/2 dark:bg-white/2">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          {highlightOverdue ? <i className="fa-solid fa-fire text-red-500"></i> : <i className="fa-solid fa-bolt text-primary"></i>}
          {title}
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center text-muted font-medium">
          <i className="fa-regular fa-folder-open text-3xl mb-3 block opacity-50"></i>
          {emptyMessage}
        </div>
      ) : (
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {items.map((task) => (
            <div key={task.id} className={`p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${highlightOverdue ? 'hover:bg-red-500/5' : 'hover:bg-background/50'}`}>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <strong className="text-foreground text-[15px] group-hover:text-primary transition-colors">{task.title}</strong>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${task.priority === 'Urgente' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-medium">
                  <span><i className="fa-regular fa-folder mr-1"></i> {task.projectName}</span>
                  <span><i className="fa-regular fa-user mr-1"></i> {task.assigneeName}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div className="text-sm font-bold text-muted">
                  <i className="fa-regular fa-calendar mr-1"></i>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : '-'}
                </div>
                <Link href={`/tarefas/${task.id}`} className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-xs font-bold text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                  Abrir
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function DashboardLists({ overdueTasks, recentTasks }: { overdueTasks: DashboardTaskItem[]; recentTasks: DashboardTaskItem[] }) {
  return (
    <div className="flex flex-col gap-8">
      <TaskList title="Demandas Atrasadas" items={overdueTasks} emptyMessage="Excelente! Nenhuma tarefa atrasada." highlightOverdue />
      <TaskList title="Tarefas Recentes" items={recentTasks} emptyMessage="Nenhuma tarefa cadastrada ainda." />
    </div>
  )
}