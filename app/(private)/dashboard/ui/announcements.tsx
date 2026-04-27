import Link from 'next/link'
// Mantenha seu import original aqui!
import { AnnouncementList } from '@/modules/announcements/ui/list'

type AvisoRow = {
  id: string; title: string; content: string; isUrgent: boolean; expiresAt: Date | null; publisherName: string; isPersonal: boolean; isForCurrentUser?: boolean; createdAt: Date
}
type Props = { avisos: AvisoRow[]; canManage?: boolean }

export function DashboardAnnouncements({ avisos, canManage }: Props) {
  // Para ver o design funcionando se não tiver avisos ainda:
  const isMockEmpty = avisos.length === 0;

  const avisosPessoais = avisos.filter(a => a.isForCurrentUser)
  const avisosGerais = avisos.filter(a => !a.isForCurrentUser).slice(0, 3)

  return (
    <div className="flex flex-col gap-6">
      
      {/* AVISOS PESSOAIS (Estilo "Sticky Note" Importante) */}
      {(avisosPessoais.length > 0 || isMockEmpty) && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <i className="fa-solid fa-thumbtack"></i>
            Avisos Direcionados
          </h2>
          {isMockEmpty ? (
             <p className="text-sm text-muted">Nenhum aviso direcionado a você no momento.</p>
          ) : (
            <AnnouncementList announcements={avisosPessoais} canManage={canManage} />
          )}
        </div>
      )}

      {/* AVISOS GERAIS DA EQUIPE */}
      <div className="bg-surface border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <i className="fa-solid fa-bullhorn text-muted"></i>
          Mural da Equipe
        </h2>
        
        {isMockEmpty ? (
            <p className="text-sm text-muted">Mural limpo no momento.</p>
        ) : (
          <>
            <AnnouncementList announcements={avisosGerais} canManage={canManage} />
            {avisos.filter(a => !a.isForCurrentUser).length > 3 && (
              <Link href="/avisos" className="mt-4 inline-flex items-center text-sm font-bold text-primary hover:underline group">
                Ver todos os comunicados 
                <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </Link>
            )}
          </>
        )}
      </div>

    </div>
  )
}