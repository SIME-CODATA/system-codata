'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 1. TIPAGEM ESTRITA DEFINIDA (Adeus, any!)
export type TaskStatus = 'pendente' | 'emAndamento' | 'concluida' | 'bloqueada' | 'cancelada'
export type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente'

export type SelectOption = {
  id: string
  name: string
}

export type TaskData = {
  id: string
  title: string
  description: string
  projectId: string
  assigneeId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
}

type TaskFormProps = {
  task: TaskData
  projects: SelectOption[]
  users: SelectOption[]
}

export function TaskForm({ task, projects, users }: TaskFormProps) {
  const router = useRouter()

  // Estados controlados do formulário
  const [title, setTitle] = useState<string>(task.title)
  const [description, setDescription] = useState<string>(task.description)
  const [projectId, setProjectId] = useState<string>(task.projectId)
  const [assigneeId, setAssigneeId] = useState<string>(task.assigneeId)
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  const [dueDate, setDueDate] = useState<string>(task.dueDate ?? '')
  
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/tarefas/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          projectId,
          assigneeId,
          status,
          priority,
          dueDate: dueDate || null,
        }),
      })

      const data: { error?: string } = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Falha ao atualizar tarefa.')
        return
      }

      router.push('/tarefas')
      router.refresh()
    } catch (err: unknown) {
      setError('Erro inesperado ao atualizar tarefa.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form 
        onSubmit={onSubmit} 
        className="bg-surface border border-black/5 dark:border-white/5 rounded-2xl shadow-lg overflow-hidden"
      >
        {/* CABEÇALHO */}
        <div className="px-6 py-5 border-b border-black/5 dark:border-white/5 bg-background/50 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <i className="fa-solid fa-pen-to-square text-primary"></i> 
            Editar Tarefa
          </h1>
          <span className="text-xs font-bold px-2 py-1 bg-black/5 dark:bg-white/5 text-muted rounded-md uppercase tracking-wider">
            ID: {task.id.slice(-6)}
          </span>
        </div>

        {/* CORPO DO FORMULÁRIO (GRID) */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título - Ocupa 2 colunas */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Título da Tarefa</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Projeto */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Vincular Projeto</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                className="w-full p-3 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="" disabled>Selecione um projeto...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            {/* Responsável */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Responsável</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full p-3 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Não atribuído</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full p-3 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="pendente">Pendente</option>
                <option value="emAndamento">Em andamento</option>
                <option value="concluida">Concluída</option>
                <option value="bloqueada">Bloqueada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full p-3 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente 🔥</option>
              </select>
            </div>

            {/* Prazo */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Prazo Final</label>
              <input
                type="date"
                value={dueDate ? dueDate.slice(0, 10) : ''}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full md:w-1/2 p-3 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Descrição - Ocupa 2 colunas */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full p-3 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* MENSAGEM DE ERRO */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}
        </div>

        {/* RODAPÉ E BOTÕES */}
        <div className="px-6 py-4 border-t border-black/5 dark:border-white/5 bg-background/50 flex gap-3 justify-end items-center">
          <button 
            type="button" 
            onClick={() => router.push('/tarefas')}
            className="px-6 py-3 bg-transparent text-muted hover:text-foreground text-sm font-bold rounded-xl transition-colors"
          >
            Cancelar
          </button>
          
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <><i className="fa-solid fa-spinner animate-spin"></i> Salvando...</>
            ) : (
              'Salvar Alterações'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}