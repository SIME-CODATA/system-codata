'use client'

import { useState } from 'react'
import { ProjectModal } from './project-modal'
import { ProjectCard } from './project-card'
import { deleteProject } from '../actions'
import Link from 'next/link'
import type { ProjectStatus, ProjectPriority } from '@/modules/projects/domain/project'

export type ProjectData = {
  id: string
  name: string
  description: string
  progress: number
  status: ProjectStatus
  dueDate: Date | string | null
  tasksTotal: number
  tasksDone: number
  priority?: ProjectPriority
  assignedUserId?: string
}

// Atualize as Props para não usar 'any'
type Props = {
  initialProjects: ProjectData[]
  userRole: string
  users: { id: string, name: string }[]
}

export function ProjetosClient({ initialProjects, userRole, users }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<ProjectData | null>(null)

  const filters = ['Todos', 'Em Andamento', 'Pendentes', 'Atrasados', 'Concluídos']

  const filteredProjects = initialProjects.filter((project: ProjectData) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === 'Todos' || project.status.toLowerCase() === activeFilter.toLowerCase() || (activeFilter === 'Concluídos' && project.status.toLowerCase() === 'concluido')
    return matchesSearch && matchesFilter
  })

  function handleCreate() {
    setProjectToEdit(null)
    setIsModalOpen(true)
  }

  function handleEdit(project: ProjectData) {
  setProjectToEdit(project)
  setIsModalOpen(true)
}

  async function handleDelete(projectId: string) {
    if (confirm("Tem certeza que deseja excluir permanentemente este projeto?")) {
      await deleteProject(projectId)
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-6">
        <div>
          <h1 className="text-[35px] font-bold text-foreground tracking-tight mb-1">Projetos</h1>
          <p className="text-muted text-[16px] font-medium">Gerencie o escopo, acompanhe o progresso e garanta as entregas.</p>
        </div>
        
        {/* ✨ Agrupamos os botões aqui */}
        <div className="flex gap-3">
          <Link 
            href="/tarefas" 
            className="px-6 py-3 bg-surface border border-black/10 dark:border-white/10 text-foreground text-sm font-bold rounded-xl shadow-sm hover:border-primary hover:text-primary transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-list-check"></i> Ver Tarefas
          </Link>
          <button 
            onClick={handleCreate} 
            className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <i className="fa-solid fa-folder-plus"></i> Criar Projeto
          </button>
        </div>
      </header>

      <section className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-surface p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
        <div className="relative w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-muted"></i>
          </div>
          <input type="text" placeholder="Buscar projeto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-background border border-black/10 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>

        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {filters.map(filter => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-lg text-sm font-bold border ${activeFilter === filter ? 'bg-primary text-white border-primary' : 'bg-background text-muted border-black/5'}`}>
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
            <ProjectCard 
                key={project.id} 
                project={project} 
                userRole={userRole} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />
        ))}
      </section>
      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} projectToEdit={projectToEdit} users={users} />
    </div>
  )
}