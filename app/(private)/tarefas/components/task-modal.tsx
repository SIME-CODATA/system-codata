'use client'

import { useState } from 'react'
import { createTask } from '../actions'

type Option = { id: string, name: string }

export function TaskModal({ 
  isOpen, 
  onClose, 
  projects, 
  users 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  projects: Option[], 
  users: Option[] 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    const result = await createTask(formData)

    setIsSubmitting(false)
    if (result.success) onClose()
    else alert(result.error)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-black/10 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-background/50">
          <h2 className="text-xl font-bold text-foreground">Nova Tarefa</h2>
          <button onClick={onClose} className="text-muted hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-lg">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Título da Tarefa</label>
            <input type="text" name="title" required placeholder="Ex: Configurar banco de dados..." className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Descrição</label>
            <textarea name="description" rows={2} required placeholder="O que precisa ser feito?" className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary outline-none"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Vincular Projeto</label>
              <select name="projectId" required className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none">
                <option value="">Selecione...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Responsável</label>
              <select name="assigneeId" className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none">
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Prioridade</label>
              <select name="priority" defaultValue="media" className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none">
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Prazo Final</label>
              <input type="date" name="dueDate" className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
            <button type="button" onClick={onClose} className="flex-1 p-3 bg-background border border-black/10 dark:border-white/10 text-sm font-bold rounded-xl hover:bg-surface transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 p-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-50">
              {isSubmitting ? 'Salvando...' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}