'use client'

import { useState, useEffect } from 'react'
import { updateProfile } from '../actions'

// Tipagens estritas baseadas no seu CSS
type ThemeOption = { id: string; name: string; color: string }
type FontOption = { id: string; name: string; family: string }

type ProfileClientProps = {
  user: {
    nome: string
    email: string
    tema: string
    fonte: string
  }
}

// 1. MAPEAMENTO EXATO DO SEU CSS GLOBAL
const themes: ThemeOption[] = [
  { id: 'default', name: 'Light Steel (Padrão)', color: '#343a40' },
  { id: 'theme-vivid-nightfall', name: 'Vivid Nightfall', color: '#5a189a' },
  { id: 'theme-red-gradient', name: 'Red Gradient', color: '#da1e37' },
  { id: 'theme-coastal-blues', name: 'Coastal Blues', color: '#01497c' },
  { id: 'theme-fresh-greens', name: 'Fresh Greens', color: '#52b788' },
  { id: 'theme-pink-ombre', name: 'Pink Ombre', color: '#ff477e' },
]

const fonts: FontOption[] = [
  { id: 'font-familjen', name: 'Familjen Grotesk', family: 'font-familjen' },
  { id: 'font-inter', name: 'Inter (SaaS)', family: 'font-inter' },
  { id: 'font-montserrat', name: 'Montserrat', family: 'font-montserrat' },
  { id: 'font-open-sans', name: 'Open Sans', family: 'font-open-sans' },
  { id: 'font-bitcount', name: 'Bitcount Grid (Retro)', family: 'font-bitcount' },
  { id: 'font-lavishly', name: 'Lavishly Yours (Elegante)', family: 'font-lavishly' },
  { id: 'font-astloch', name: 'Astloch', family: 'font-astloch' },
]

export function ProfileClient({ user }: ProfileClientProps) {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [selectedTheme, setSelectedTheme] = useState<string>(user.tema || 'default')
  const [selectedFont, setSelectedFont] = useState<string>(user.fonte || 'font-familjen')

  // ✨ EFEITO DE PREVIEW EM TEMPO REAL ✨
  // Assim que o usuário clica num tema ou fonte, injetamos a classe direto no HTML
  useEffect(() => {
    const html = document.documentElement

    // Limpa todos os temas e fontes antigas
    themes.forEach(t => html.classList.remove(t.id))
    fonts.forEach(f => html.classList.remove(f.id))

    // Aplica as novas escolhas
    if (selectedTheme !== 'default') html.classList.add(selectedTheme)
    if (selectedFont) html.classList.add(selectedFont)

  }, [selectedTheme, selectedFont])

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    const formData = new FormData(event.currentTarget)
    const res = await updateProfile(formData)
    setIsSaving(false)
    if (res.success) alert(res.message)
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className="mb-10 border-b border-black/5 dark:border-white/5 pb-6">
        <h1 className="text-[35px] font-bold text-foreground tracking-tight">Meu Perfil</h1>
        <p className="text-muted text-[16px] font-medium">Personalize sua experiência no centro de comando.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LADO ESQUERDO: INFO E SEGURANÇA */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Card: Dados Pessoais */}
          <form onSubmit={handleProfileSubmit} className="bg-surface border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <i className="fa-regular fa-id-card text-primary"></i> Informações Pessoais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Nome Completo</label>
                <input 
                  name="nome" 
                  defaultValue={user.nome} 
                  required
                  className="w-full p-3 bg-background border border-black/10 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all text-foreground"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">E-mail (Não alterável)</label>
                <input 
                  value={user.email} 
                  disabled 
                  className="w-full p-3 bg-black/5 dark:bg-white/5 border border-transparent rounded-xl text-sm text-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-8 border-t border-black/5 dark:border-white/5 pt-6 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <><i className="fa-solid fa-spinner animate-spin"></i> Salvando...</>
                ) : (
                  'Salvar Preferências'
                )}
              </button>
            </div>

            {/* Enviamos a classe exata do CSS para a Server Action */}
            <input type="hidden" name="tema" value={selectedTheme} />
            <input type="hidden" name="fonte" value={selectedFont} />
          </form>

          {/* Card: Segurança (Senha) */}
          <div className="bg-surface border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-red-500">
              <i className="fa-solid fa-shield-halved"></i> Segurança
            </h2>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted">Deseja atualizar sua chave de acesso ao sistema?</p>
              <button className="w-fit px-6 py-2.5 bg-red-500/10 text-red-600 border border-red-500/20 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all">
                Mudar minha senha
              </button>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: PREFERÊNCIAS VISUAIS */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-surface border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted mb-6">Aparência</h2>
            
            <div className="flex flex-col gap-6">
              
              {/* Seleção de Temas */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-3">Tema do Sistema</span>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTheme(t.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                        selectedTheme === t.id 
                        ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                        : 'border-black/5 dark:border-white/5 hover:bg-background text-muted'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: t.color }}></div>
                      <span className="text-center">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seleção de Fontes */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-3">Tipografia</span>
                <div className="flex flex-col gap-2">
                  {fonts.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFont(f.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedFont === f.id 
                        ? 'border-primary bg-primary/5 text-primary font-bold' 
                        : 'border-black/5 dark:border-white/5 text-muted hover:bg-background'
                      } ${f.family}`}
                    >
                      <span className="text-base">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
            <p className="text-[11px] text-primary font-bold leading-relaxed">
              <i className="fa-solid fa-circle-info mr-1"></i> As mudanças visuais são aplicadas em tempo real. Não esqueça de Salvar Preferências para manter!
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}