'use client'
import { ThemeToggle } from '../ui/theme-toggle'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from '@/core/theme/theme-context'

type SidebarProps = {
  userRole?: string
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()
  const { isDark } = useTheme()

  const isAdmin = userRole === 'adminGeral' || userRole === 'superAdmin'

  // Menus Principais
  const mainLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { href: '/projetos', label: 'Projetos & Tarefas', icon: (
      <i className="fa-solid fa-folder-tree"></i>
    )},
    { href: '/agenda', label: 'Agenda', icon: (
      <i className="fa-regular fa-calendar-days"></i>
    )},
    { href: '/avisos', label: 'Quadro de Avisos', icon: (
      <i className="fa-solid fa-thumbtack "></i>
    )},
    { href: '/planner', label: 'Microsoft Planner', icon: (
        <i className="fa-brands fa-microsoft"></i>
    )},
  ]

  // Menus Administrativos (Só aparecem se for admin)
  const adminLinks = [
    { href: '/usuarios', label: 'Gerenciar Usuários', icon: (
      <i className="fa-solid fa-users-gear"></i>
    )},
    { href: '/gestao', label: 'Gestão de Equipe', icon: (
      <i className="fa-solid fa-address-book"></i>
    )},
    { href: '/cofre', label: 'Cofre', icon: (
      <i className="fa-solid fa-vault"></i>
    )},
  ]

  return (
    <aside className={`flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out bg-surface border-r border-black dark:border-white ${isExpanded ? 'w-64' : 'w-20'}`}>
      {/* CABEÇALHO DA SIDEBAR (Logo + Botão de Retrair) */}
      <div className="flex items-center justify-between px-3 h-20 border-b border-black/5 dark:border-white/5">
        <div className={`flex items-center overflow-hidden transition-all duration-300 ${isExpanded ? 'w-full' : 'w-0 opacity-0'}`}>
            <Image src="/LogoCodata.svg" 
                alt="Logo da CODATA"
                width={120} 
                height={40} 
                className={`object-contain w-auto h-8 transition-all duration-500 ${isDark ? 'invert' : ''}`}
                priority={true} 
            />
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-lg text-muted hover:bg-background hover:text-primary transition-colors shrink-0">
            <div className="flex flex-col justify-around w-8.75 h-6 cursor-pointer">
                <span className={` w-full h-1 rounded-[10px] bg-current relativetransition-all duration-300 ${isExpanded ? "rotate-150 scale-[0.7] delay-100" : "delay-0"}`}/>
                <span className={`w-full h-1 rounded-[10px] bg-current relative transition-all duration-300 ${isExpanded ? "translate-y-2.5 opacity-0 delay-300" : "delay-0"} `}/>
                <span className={`w-full h-1 rounded-[10px] bg-current relative transition-all duration-300 ${isExpanded ? "-translate-y-1 rotate-213 scale-[0.7] delay-100" : "delay-0" }`}/>
            </div>
        </button>
      </div>

      {/* TOGGLE MODO ESCURO*/}
      <ThemeToggle isExpanded={isExpanded} />

      <div className="flex-1 w-full px-3 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/50">
        {/* NAVEGAÇÃO PRINCIPAL */}
        <nav className="flex flex-col gap-2 border-black dark:border-white py-6 border-t">
          {mainLinks.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center h-12 rounded-lg transition-colors overflow-hidden ${isActive ? 'bg-primary text-white' : 'text-muted hover:bg-background hover:text-primary'} ${isExpanded ? 'px-3 justify-start' : 'justify-center'}`}
                title={!isExpanded ? link.label : undefined}
              >
                <div className="shrink-0">{link.icon}</div>
                {isExpanded && <span className="ml-3 text-sm font-medium whitespace-nowrap">{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* NAVEGAÇÃO ADMIN (Divisor) */}
        {isAdmin && (
          <div className="py-6 border-t border-black dark:border-white">
            {isExpanded && <span className="px-3 text-xs font-bold uppercase tracking-wider text-muted/50 mb-2 block whitespace-nowrap">Administração</span>}
            <nav className="flex flex-col gap-2">
              {adminLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`flex items-center h-12 rounded-lg transition-colors overflow-hidden ${isActive ? 'bg-primary text-white' : 'text-muted hover:bg-background hover:text-primary'} ${isExpanded ? 'px-3 justify-start' : 'justify-center'}`}
                    title={!isExpanded ? link.label : undefined}
                  >
                    <div className="shrink-0">{link.icon}</div>
                    {isExpanded && <span className="ml-3 text-sm font-medium whitespace-nowrap">{link.label}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
        {/* alinhado ao final DA SIDEBAR (Logout) */}
        <div className='border-black dark:border-white mt-auto pt-4 border-t gap-2 flex flex-col justify-end'>
            <Link  href="../../../../api/auth/logout"  className={`flex items-center h-12 rounded-lg text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors overflow-hidden ${isExpanded ? 'px-3 justify-start' : 'justify-center relative top-8'}`}title="Sair do Sistema">
                <i className="fa-solid fa-power-off"></i>
                {isExpanded && <span className="ml-3 text-sm font-medium whitespace-nowrap">Encerrar Sessão</span>}
            </Link>
        </div>
      </div>

      {/* RODAPÉ DA SIDEBAR (Conta) */}
      <div className="p-3 border-t border-black dark:border-white mt-auto">
        <Link  href="/perfil"  className={`flex items-center h-12 rounded-lg text-muted hover:bg-background transition-colors overflow-hidden ${isExpanded ? 'px-3 justify-start' : 'justify-center'}`}title="Sair do Sistema">
            <i className="fa-regular fa-circle-user"></i>
            {isExpanded && <span className="ml-3 text-sm font-medium whitespace-nowrap">Perfil</span>}
        </Link>
      </div>
    </aside>
  )
}