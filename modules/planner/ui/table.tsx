import type { PlannerMirrorTask } from '@/modules/planner/domain/planner'

type Props = {
  tasks: PlannerMirrorTask[]
}

export function PlannerTable({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-black/5 bg-surface p-8 text-center">
        <h2 className="font-bold text-foreground">Nenhuma tarefa do Planner importada</h2>
        <p className="text-sm text-muted">
          Conecte sua conta Microsoft e clique em sincronizar.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-surface">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-black/5">
            <th className="p-4 text-xs font-bold uppercase text-muted">Tarefa</th>
            <th className="p-4 text-xs font-bold uppercase text-muted">Plano</th>
            <th className="p-4 text-xs font-bold uppercase text-muted">Bucket</th>
            <th className="p-4 text-xs font-bold uppercase text-muted">Progresso</th>
            <th className="p-4 text-xs font-bold uppercase text-muted">Prazo</th>
            <th className="p-4 text-xs font-bold uppercase text-muted">Sync</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b border-black/5">
              <td className="p-4 font-bold text-foreground">{task.title}</td>
              <td className="p-4 text-sm text-muted">{task.planTitle ?? '-'}</td>
              <td className="p-4 text-sm text-muted">{task.bucketName ?? '-'}</td>
              <td className="p-4 text-sm text-muted">{task.percentComplete}%</td>
              <td className="p-4 text-sm text-muted">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('pt-BR')
                  : '-'}
              </td>
              <td className="p-4 text-sm text-muted">{task.syncStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}