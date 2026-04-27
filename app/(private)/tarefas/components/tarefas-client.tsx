'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TaskFilters } from '@/modules/tasks/ui/filters'
import { TaskTable } from '@/modules/tasks/ui/table'
import { TaskModal } from './task-modal'

import type { TaskData } from '@/modules/tasks/types/task-data'

type Params = {
  status?: string
  priority?: string
  projectId?: string
  assigneeId?: string
}

type Props = {
  tasks: TaskData[]
  projects: { id: string; name: string }[]
  users: { id: string; name: string }[]
  params: Params
}

export function TarefasClient({ tasks, projects, users, params }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER DA PÁGINA */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-6 mb-4">
        <div>
          <h1 className="text-[35px] font-bold text-foreground tracking-tight mb-1">Tarefas</h1>
          <p className="text-muted text-[16px] font-medium">Filtre, organize e gerencie as atividades da equipe.</p>
        </div>
        
        <div className="flex gap-3">
          <Link 
            href="/projetos" 
            className="px-6 py-3 bg-surface border border-black/10 dark:border-white/10 text-foreground text-sm font-bold rounded-xl shadow-sm hover:border-primary hover:text-primary transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Voltar para Projetos
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> Nova Tarefa
          </button>
        </div>
      </header>

      {/* FILTROS E TABELA */}
      <TaskFilters
        projects={projects}
        users={users}
        currentStatus={params.status}
        currentPriority={params.priority}
        currentProjectId={params.projectId}
        currentAssigneeId={params.assigneeId}
      />

      <TaskTable tasks={tasks} />

      {/* MODAL DE CRIAÇÃO */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        projects={projects} 
        users={users} 
      />
      
    </div>
  )
}