'use client'

import { useState } from 'react'
import { createProject, updateProject } from '../actions'
import type { ProjectData } from './projetos-client'

type UserOption = { id: string, name: string }

export function ProjectModal({ 
  isOpen, 
  onClose, 
  projectToEdit = null, 
  users 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  projectToEdit?: ProjectData | null
  users: UserOption[]
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const isEditing = !!projectToEdit

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    const result = isEditing 
      ? await updateProject(projectToEdit.id, formData) 
      : await createProject(formData)

    setIsSubmitting(false)
    if (result.success) onClose()
    else alert(result.error)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-black/10 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-background/50">
          <h2 className="text-xl font-bold text-foreground">{isEditing ? 'Editar Projeto' : 'Novo Projeto'}</h2>
          <button onClick={onClose} className="text-muted hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-lg">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Nome do Projeto</label>
            <input type="text" name="name" required defaultValue={projectToEdit?.name || ''} className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Descrição</label>
            <textarea name="description" rows={2} required defaultValue={projectToEdit?.description || ''} className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary outline-none"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Prioridade</label>
              <select name="priority" defaultValue={projectToEdit?.priority || 'media'} className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none">
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Responsável</label>
              <select name="assignedTo" defaultValue={projectToEdit?.assignedUserId || ''} className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none">
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Prazo Final</label>
            <input type="date" name="dueDate" defaultValue={projectToEdit?.dueDate ? new Date(projectToEdit.dueDate).toISOString().split('T')[0] : ''} className="w-full p-2.5 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
            <button type="button" onClick={onClose} className="flex-1 p-3 bg-background border border-black/10 dark:border-white/10 text-sm font-bold rounded-xl hover:bg-surface">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 p-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 disabled:opacity-50">
              {isSubmitting ? 'Salvando...' : 'Salvar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}