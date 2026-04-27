'use client'

import { useTheme } from '@/core/theme/theme-context'

type ThemeToggleProps = {
  isExpanded: boolean
}

export function ThemeToggle({ isExpanded }: ThemeToggleProps) {
  const { isDark, toggleDarkMode } = useTheme()

  return (
    <div className={`px-3 flex ${isExpanded ? 'justify-start' : 'justify-center'}`}>
      <button
        onClick={toggleDarkMode}
        className={`flex items-center rounded-full transition-all duration-200 active:scale-95 group ${isExpanded ? 'w-full' : 'w-14 justify-center'}`}
        title={isDark ? "Mudar para Claro" : "Mudar para Escuro"}
      >
        
        {/* O CONTAINER DA ANIMAÇÃO */}
        <div className="relative grid w-9 h-9 place-items-center rounded-full overflow-hidden shrink-0 bg-surface border border-primary/10 group-hover:border-primary/30 transition-colors">
          
          {/* ÍCONE DA LUA (Aparece no Modo Escuro) */}
          <div  className={`col-start-1 row-start-1 w-full h-full grid place-items-center rounded-full origin-center transition-all duration-500 ease-in-out text-black bg-primary ${isDark ? 'rotate-360 scale-100 opacity-100' : 'rotate-0 scale-0 opacity-0'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          </div>

          {/* ÍCONE DO SOL (Aparece no Modo Claro) */}
          <div className={`col-start-1 row-start-1 w-full h-full grid place-items-center rounded-full origin-center transition-all duration-500 ease-in-out text-primary bg-background
            ${!isDark ? 'rotate-360 scale-100 opacity-100' : 'rotate-0 scale-0 opacity-0'}`} >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          </div>

        </div>

        {/* TEXTO (Aparece apenas se a sidebar estiver expandida) */}
        {isExpanded && (
          <span className="ml-4 text-sm font-bold whitespace-nowrap text-muted group-hover:text-primary transition-colors">
            {isDark ? 'Modo Escuro' : 'Modo Claro'}
          </span>
        )}
      </button>
    </div>
  )
}