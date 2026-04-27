'use client'

import Link from 'next/link'
import type { TaskData } from '@/modules/tasks/types/task-data'

export function TaskTable({ tasks }: { tasks: TaskData[] }) {
  
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 bg-surface rounded-2xl border border-black/5 dark:border-white/5 mt-6">
        <i className="fa-solid fa-clipboard-check text-4xl text-muted/50 mb-4 block"></i>
        <h3 className="text-lg font-bold text-foreground mb-1">Nenhuma tarefa encontrada</h3>
        <p className="text-muted text-sm">Altere os filtros ou crie uma nova tarefa.</p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/2 dark:bg-white/2 border-b border-black/5 dark:border-white/5">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Título</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Projeto</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Responsável</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted text-center">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted text-center">Prioridade</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Prazo</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {tasks.map((task) => {
              
              // Cores do Status
              let statusColor = 'bg-primary/10 text-primary'
              if (task.status === 'concluida') statusColor = 'bg-green-500/10 text-green-600'
              if (task.status === 'atrasado' || task.status === 'bloqueada' || task.status === 'cancelada') statusColor = 'bg-red-500/10 text-red-500'
              if (task.status === 'pendente') statusColor = 'bg-black/5 dark:bg-white/5 text-muted'

              // Cores da Prioridade
              let priorityColor = 'text-muted'
              if (task.priority === 'urgente') priorityColor = 'text-red-500 font-bold'
              if (task.priority === 'alta') priorityColor = 'text-orange-500 font-bold'
              if (task.priority === 'media') priorityColor = 'text-primary'

              return (
                <tr key={task.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors group">
                  <td className="p-4 flex flex-col gap-1">
                    <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{task.title}</span>
                    descrição
                    <span>{task.description}</span>
                  </td>
                  <td className="p-4 text-sm text-muted">{task.projectName}</td>
                  <td className="p-4 text-sm text-muted flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {task.assigneeName ? task.assigneeName.charAt(0).toUpperCase() : '?'}
                    </div>
                    {task.assigneeName || 'Não atribuído'}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4 text-center text-sm">
                    <span className={priorityColor}>{task.priority || 'Média'}</span>
                  </td>
                  <td className="p-4 text-sm text-muted">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/tarefas/${task.id}`} className="p-2 text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10 inline-flex" title="Editar Tarefa">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}