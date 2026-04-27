'use client'

import { useState, useRef, useEffect } from 'react'
import type { ProjectData } from './projetos-client' // Importamos a tipagem estrita!

type ProjectCardProps = {
  project: ProjectData
  userRole: string
  onEdit: (project: ProjectData) => void
  onDelete: (id: string) => void
}

export function ProjectCard({ project, userRole, onEdit, onDelete }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fecha o menu se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isAdmin = userRole === 'superAdmin' || userRole === 'adminGeral'
  const isCompleted = project.status.toLowerCase() === 'concluido' || project.status.toLowerCase() === 'concluído'

  // Cores dinâmicas
  let statusColor = 'bg-primary/10 text-primary'
  let statusIcon = 'fa-solid fa-spinner'
  let progressColor = 'bg-primary'
  
  if (isCompleted) { 
    statusColor = 'bg-green-500/10 text-green-600 dark:text-green-400'
    statusIcon = 'fa-solid fa-check-double'
    progressColor = 'bg-green-500' 
  } else if (project.status.toLowerCase() === 'atrasado') { 
    statusColor = 'bg-red-500/10 text-red-600 dark:text-red-400'
    statusIcon = 'fa-solid fa-fire'
    progressColor = 'bg-red-500' 
  } else if (project.status.toLowerCase() === 'pendente' || project.status.toLowerCase() === 'naoiniciado') { 
    statusColor = 'bg-black/5 dark:bg-white/5 text-muted'
    statusIcon = 'fa-regular fa-clock'
    progressColor = 'bg-muted' 
  }

  return (
    <div className="bg-surface rounded-2xl border border-black/5 dark:border-white/5 p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col group relative">
      
      {/* TOPO: Status e Menu Dropdown */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 ${statusColor}`}>
          <i className={statusIcon}></i> {project.status}
        </span>
        
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-muted hover:text-primary transition-colors p-1">
            <i className="fa-solid fa-ellipsis-vertical text-lg px-2"></i>
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-surface border border-black/10 dark:border-white/10 rounded-xl shadow-lg z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <button onClick={() => { setMenuOpen(false); onEdit(project) }} className="w-full text-left px-4 py-2 text-sm font-bold text-foreground hover:bg-background transition-colors flex items-center gap-2">
                <i className="fa-solid fa-pen text-muted"></i> Editar
              </button>
              
              {/* Só Admin vê o Excluir, e só se estiver Concluído */}
              {isAdmin && isCompleted && (
                <button onClick={() => { setMenuOpen(false); onDelete(project.id) }} className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-trash"></i> Excluir
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* INFORMAÇÕES CENTRAIS */}
      <h2 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
        {project.name}
      </h2>
      <span className="text-[10px] uppercase font-bold text-muted mb-3 flex items-center gap-1">
        <i className="fa-solid fa-flag"></i> Prioridade: {project.priority || 'Média'}
      </span>
      <p className="text-sm text-muted mb-6 line-clamp-2 min-h-[40px]">
        {project.description}
      </p>

      {/* RODAPÉ: Barra de Progresso e Contadores */}
      <div className="mt-auto">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-muted">Progresso</span>
          <span className="text-lg font-bold text-foreground">{project.progress}%</span>
        </div>
        
        {/* A Barra Colorida */}
        <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-black/5 dark:border-white/5 mb-4">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor}`} 
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>

        {/* ✨ AS TAREFAS VOLTARAM AQUI! */}
        <div className="flex justify-between items-center pt-3 border-t border-black/5 dark:border-white/5 text-[11px] font-bold text-muted">
          
          <div className="flex items-center gap-1.5" title="Tarefas Concluídas">
            <i className="fa-solid fa-list-check text-primary/70"></i>
            <span>{project.tasksDone} / {project.tasksTotal} Tarefas</span>
          </div>

          <div className="flex items-center gap-1.5" title="Prazo Final">
            <i className="fa-regular fa-calendar"></i>
            <span>
              {project.dueDate 
                ? new Date(project.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) 
                : 'Sem prazo'}
            </span>
          </div>
          
        </div>
      </div>
      
    </div>
  )
}