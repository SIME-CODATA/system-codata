import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE } from '@/core/security/cookie'
import { readSessionToken } from '@/core/security/session'
import { UserRepo } from '@/modules/users/infra/repo'
import { UserForm } from '@/modules/users/ui/form'
import { UserList } from '@/modules/users/ui/list'

export default async function UsuariosPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const cookieStore = await cookies()
  const session = readSessionToken(cookieStore.get(SESSION_COOKIE)?.value)
  
  if (!session || (session.role !== 'adminGeral' && session.role !== 'superAdmin')) {
    redirect('/dashboard') 
  }

  const repo = new UserRepo()
  const users = await repo.list()

  // Lida com o modo edição
  const params = await searchParams
  const editId = params.edit
  let userToEdit = null
  if (editId) {
    userToEdit = await repo.findById(editId)
  }

  return (
    <div>
      <h1>Gestão de Equipe e Acessos</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Adicione membros da CODATA, defina níveis de permissão ou desative contas de quem não faz mais parte da equipe.</p>
      <UserForm initialData={userToEdit} />
      <UserList users={users} />
    </div>
  )
}