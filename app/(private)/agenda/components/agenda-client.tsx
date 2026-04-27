'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { TaskPriority, TaskStatus } from '@/modules/tasks/ui/form' // Reutilizando os tipos que já criamos!

// Tipagem estrita para as tarefas que vão aparecer na agenda
export type AgendaTask = {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string // Formato YYYY-MM-DD para facilitar a comparação
}

type AgendaClientProps = {
  tasks: AgendaTask[]
}

export function AgendaClient({ tasks }: AgendaClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Matemática do Calendário
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  // Primeiro dia do mês (0 = Domingo, 1 = Segunda...)
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  // Quantidade de dias no mês atual
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Navegação dos meses
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const goToToday = () => setCurrentDate(new Date())

  // Array com os nomes dos meses e dias da semana
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  // Gera os quadrados em branco do calendário antes do dia 1
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i)
  // Gera os quadrados reais do mês
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER DA PÁGINA */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-6">
        <div>
          <h1 className="text-[35px] font-bold text-foreground tracking-tight mb-1">Agenda</h1>
          <p className="text-muted text-[16px] font-medium">Acompanhe os prazos de entrega e o cronograma da equipe.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={goToToday}
            className="px-4 py-2 bg-surface border border-black/10 dark:border-white/10 text-foreground text-sm font-bold rounded-xl shadow-sm hover:border-primary hover:text-primary transition-all"
          >
            Hoje
          </button>
          <div className="flex bg-surface border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
            <button onClick={prevMonth} className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-r border-black/10 dark:border-white/10">
              <i className="fa-solid fa-chevron-left text-muted"></i>
            </button>
            <button onClick={nextMonth} className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <i className="fa-solid fa-chevron-right text-muted"></i>
            </button>
          </div>
        </div>
      </header>

      {/* TÍTULO DO MÊS ATUAL */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground capitalize">
          {monthNames[month]} <span className="text-muted font-medium">{year}</span>
        </h2>
      </div>

      {/* O CALENDÁRIO */}
      <div className="bg-surface border border-black/10 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Cabeçalho dos Dias da Semana */}
        <div className="grid grid-cols-7 bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5">
          {weekDays.map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Grid de Dias */}
        <div className="grid grid-cols-7 auto-rows-fr bg-black/5 dark:bg-white/5 gap-px">
          
          {/* Espaços Vazios (Dias do mês anterior) */}
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="bg-surface/50 min-h-[120px] p-2"></div>
          ))}

          {/* Dias Reais do Mês */}
          {days.map(day => {
            // Formata a data atual do loop para YYYY-MM-DD
            const cellDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            
            // Filtra as tarefas que vencem neste exato dia
            const tasksToday = tasks.filter(t => t.dueDate === cellDateString)

            // Verifica se este quadrado é o dia de HOJE real
            const isToday = new Date().toISOString().split('T')[0] === cellDateString

            return (
              <div key={day} className={`bg-surface min-h-[120px] p-2 flex flex-col gap-1 transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.01] ${isToday ? 'bg-primary/[0.02]' : ''}`}>
                
                {/* Número do Dia */}
                <div className="flex justify-end mb-1">
                  <span className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-full ${isToday ? 'bg-primary text-white shadow-md' : 'text-muted'}`}>
                    {day}
                  </span>
                </div>

                {/* Lista de Tarefas do Dia */}
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] pr-1 custom-scrollbar">
                  {tasksToday.map(task => {
                    // Define a cor pela prioridade
                    let bgColor = 'bg-primary/10 text-primary border-primary/20'
                    if (task.priority === 'urgente') bgColor = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                    if (task.priority === 'alta') bgColor = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                    
                    // Se estiver concluída, fica cinza com risco
                    if (task.status === 'concluida') bgColor = 'bg-black/5 dark:bg-white/5 text-muted line-through border-transparent'

                    return (
                      <Link 
                        key={task.id}
                        href={`/tarefas?taskId=${task.id}`} // Leva para a tela de tarefas se clicar
                        title={task.title}
                        className={`text-[10px] font-bold px-2 py-1 rounded truncate border transition-colors hover:brightness-95 ${bgColor}`}
                      >
                        {task.title}
                      </Link>
                    )
                  })}
                </div>

              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}