'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type FilterProps = {
  projects: { id: string; name: string }[]
  users: { id: string; name: string }[]
  currentStatus?: string
  currentPriority?: string
  currentProjectId?: string
  currentAssigneeId?: string
}

export function TaskFilters({ projects, users, currentStatus, currentPriority, currentProjectId, currentAssigneeId }: FilterProps) {
  const router = useRouter()
  
  const [status, setStatus] = useState(currentStatus || '')
  const [priority, setPriority] = useState(currentPriority || '')
  const [projectId, setProjectId] = useState(currentProjectId || '')
  const [assigneeId, setAssigneeId] = useState(currentAssigneeId || '')

  function handleFilter() {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (priority) params.set('priority', priority)
    if (projectId) params.set('projectId', projectId)
    if (assigneeId) params.set('assigneeId', assigneeId)
    
    router.push(`/tarefas?${params.toString()}`)
  }

  function handleClear() {
    setStatus('')
    setPriority('')
    setProjectId('')
    setAssigneeId('')
    router.push('/tarefas')
  }

  return (
    <div className="bg-surface p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm mb-6 flex flex-col xl:flex-row gap-4 items-end">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none">
            <option value="">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="emAndamento">Em andamento</option>
            <option value="concluida">Concluída</option>
            <option value="bloqueada">Bloqueada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Prioridade</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none">
            <option value="">Todas</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Projeto</label>
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none">
            <option value="">Todos</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Responsável</label>
          <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none">
            <option value="">Todos</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2 w-full xl:w-auto mt-4 xl:mt-0">
        <button onClick={handleClear} className="flex-1 xl:flex-none px-6 py-2.5 bg-background border border-black/10 dark:border-white/10 text-muted text-sm font-bold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          Limpar
        </button>
        <button onClick={handleFilter} className="flex-1 xl:flex-none px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">
          Filtrar
        </button>
      </div>

    </div>
  )
}