'use client'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '../src/components/ui/theme-toggle'

export default function LandingPage() {
  const router = useRouter()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 bg-background text-foreground font-sans`}>
      
      {/* 1. NAVEGAÇÃO SUPERIOR */}
      <header className="flex flex-wrap items-center justify-between p-6 md:px-12 bg-surface shadow-sm border-b border-black/5 sticky top-0 z-50">
        <div className="font-bold text-[30px] text-primary tracking-tight">
          CODATA
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 md:mt-0">
          <ThemeToggle isExpanded={false}/>
          <button onClick={() => router.push('/login')} className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-colors shadow-md text-[14px]" > Acessar Sistema </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 min-h-[70vh]">
        <h1 className="text-[50px] md:text-[75px] font-bold leading-tight mb-6 max-w-5xl text-foreground">
          <span className="text-primary">CODATA</span> — Tecnologia e Dados para a Gestão Pública
        </h1>
        
        <p className="text-[20px] md:text-[25px] text-muted mb-12 max-w-3xl leading-relaxed">
          Integramos dados, desenvolvemos soluções e apoiamos decisões estratégicas na Prefeitura de São Paulo.
        </p>

        <div className="flex gap-4">
          <button 
            onClick={() => scrollToSection('sobre')}
            className="px-8 py-4 bg-surface border border-primary/20 hover:bg-background text-primary text-[18px] font-bold rounded-xl transition-colors shadow-sm"
          >
            Conheça a CODATA
          </button>
          <button 
            onClick={() => scrollToSection('projetos')}
            className="px-8 py-4 bg-primary hover:bg-primary-hover text-white text-[18px] font-bold rounded-xl transition-colors shadow-lg"
          >
            O Que Fazemos
          </button>
        </div>
      </main>

      {/* 3. SOBRE A CODATA */}
      <section id="sobre" className="py-24 bg-surface border-y border-black/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[35px] font-bold text-primary mb-6">Apresentação Institucional</h2>
            <p className="text-[18px] text-muted mb-6 leading-relaxed">
              A Coordenadoria de Tecnologia e Dados (CODATA) é uma unidade da Secretaria Municipal de Planejamento e Eficiência responsável por desenvolver, integrar e gerenciar soluções tecnológicas e dados estratégicos da Prefeitura de São Paulo.
            </p>
            <p className="text-[18px] text-muted mb-8 leading-relaxed">
              Sua atuação é voltada ao fortalecimento da gestão pública baseada em evidências, promovendo a integração de informações entre órgãos municipais e o desenvolvimento de sistemas que apoiem o planejamento, o monitoramento e a tomada de decisão.
            </p>
            <blockquote className="border-l-4 border-primary pl-6 py-2 text-[20px] font-semibold italic text-foreground bg-background/50 rounded-r-lg">
              A CODATA conecta dados, tecnologia e gestão para melhorar a tomada de decisão na Prefeitura.
            </blockquote>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-black/5">
              <h3 className="text-[20px] font-bold text-primary mb-3 flex items-center gap-2">
                <span className="text-[25px]">🎯</span> Missão
              </h3>
              <p className="text-[16px] text-muted leading-relaxed">
                Transformar dados em soluções tecnológicas que apoiem decisões estratégicas e melhorem a gestão pública municipal.
              </p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-black/5">
              <h3 className="text-[20px] font-bold text-primary mb-3 flex items-center gap-2">
                <span className="text-[25px]">🔭</span> Visão
              </h3>
              <p className="text-[16px] text-muted leading-relaxed">
                Ser referência em inovação, integração de dados e desenvolvimento tecnológico no setor público.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. O QUE FAZEMOS */}
      <section id="projetos" className="py-24 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-[35px] font-bold text-primary mb-12">O Que Fazemos</h2>
        
        {/* Layout com 5 cards: 3 em cima, 2 centralizados embaixo */}
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { icon: '💻', title: 'Desenvolvimento de Sistemas' },
            { icon: '📊', title: 'Análise de Dados' },
            { icon: '🔗', title: 'Integração de Sistemas' },
            { icon: '🧠', title: 'Inteligência para Gestão' },
            { icon: '⚙️', title: 'Infraestrutura de Dados' }
          ].map((item, index) => (
            <div key={index} className="bg-surface p-8 rounded-2xl shadow-sm border border-black/5 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] min-w-70 hover:-translate-y-1 transition-transform duration-300">
              <div className="text-[40px] mb-4">{item.icon}</div>
              <h3 className="text-[20px] font-bold text-foreground">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BASE LEGAL */}
      <section className="py-24 bg-surface border-y border-black/5 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[35px] font-bold text-primary mb-4">Base Legal</h2>
            <p className="text-[18px] text-muted font-medium">A CODATA está regulamentada pelo Decreto nº 64.341 de 2 de julho de 2025.</p>
          </div>

          <div className="bg-background p-8 md:p-10 rounded-2xl shadow-sm border border-black/5 text-[16px] text-muted leading-relaxed space-y-6 text-justify">
            <p>
              A Coordenadoria de Tecnologia e Dados – CODATA integra a estrutura da Secretaria Executiva de Informações e Monitoramento Estratégicos, da Secretaria Municipal de Planejamento e Eficiência do Município de São Paulo, nos termos do Decreto nº 64.341 de 2 de julho de 2025.
            </p>
            <p>
              Compete à CODATA desenvolver e implementar projetos, estudos e sistemas relacionados à ciência e engenharia de dados, bem como administrar a infraestrutura centralizada de dados da Secretaria, promovendo a integração de bases de dados e o uso de evidências na formulação, implementação e avaliação de políticas públicas.
            </p>
            <p>
              Adicionalmente, a coordenadoria atua no desenvolvimento de soluções tecnológicas, na integração de informações provenientes de diferentes órgãos da Administração Pública Municipal e na coordenação técnica de sistemas estratégicos, com destaque para o Sistema de Monitoramento e Acompanhamento Estratégico – SMAE.
            </p>
            <p>
              A CODATA também presta suporte técnico às demais unidades da Secretaria, promove a inovação por meio do uso de tecnologias e estabelece parcerias com instituições públicas e privadas para o desenvolvimento de projetos voltados à modernização da gestão pública.
            </p>
          </div>

          <div className="mt-8 text-center">
            <a  href="https://legislacao.prefeitura.sp.gov.br/leis/decreto-64341-de-2-de-julho-de-2025" 
              target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-background border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors shadow-sm" > Ver decreto completo</a>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 text-center bg-background mt-auto flex flex-col items-center gap-2 border-t border-black/5">
        <p className="text-[16px] font-bold text-foreground">Prefeitura de São Paulo</p>
        <p className="text-[14px] text-muted mt-2">© {new Date().getFullYear()} Coordenadoria de Tecnologia e Dados (CODATA)</p>
      </footer>

    </div>
  )
}