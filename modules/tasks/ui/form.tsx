'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Option = {
  id: string
  name: string
}

type TaskFormProps = {
  task: {
    id: string
    title: string
    description: string
    projectId: string
    assigneeId: string
    status: string
    priority: string
    dueDate: string | null
  }
  projects: Option[]
  users: Option[]
}

export function TaskForm({ task, projects, users }: TaskFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [projectId, setProjectId] = useState(task.projectId)
  const [assigneeId, setAssigneeId] = useState(task.assigneeId)
  const [status, setStatus] = useState(task.status)
  const [priority, setPriority] = useState(task.priority)
  const [dueDate, setDueDate] = useState(task.dueDate ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Falha ao atualizar tarefa.')
        return
      }

      router.push('/tarefas')
      router.refresh()
    } catch {
      setError('Erro inesperado ao atualizar tarefa.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 720 }}>
      <h1>Editar tarefa</h1>

      <div style={{ marginBottom: 12 }}>
        <label>Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', minHeight: 100 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Projeto</label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          style={{ width: '100%' }}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Responsável</label>
        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          style={{ width: '100%' }}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: '100%' }}
        >
          <option value="pendente">Pendente</option>
          <option value="emAndamento">Em andamento</option>
          <option value="concluida">Concluída</option>
          <option value="bloqueada">Bloqueada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Prioridade</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ width: '100%' }}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Prazo</label>
        <input
          type="date"
          value={dueDate ? dueDate.slice(0, 10) : ''}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}

      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </form>
  )
}