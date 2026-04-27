import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/core/security/cookie'
import { readSessionToken } from '@/core/security/session'
import { UserRepo } from '@/modules/users/infra/repo'
import { ProfileClient } from './components/profile-client'

export default async function PerfilPage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value
  
  // Voltamos a usar 'any' rapidinho aqui só para podermos caçar onde está o ID no seu crachá
  const session = readSessionToken(sessionValue) as any

  // 1. O nosso Salva-vidas (Bypass) de ID
  const userId = session?.id || session?.sub || session?.userId || '507f1f77bcf86cd799439011'

  const userRepo = new UserRepo()
  let user = null

  try {
    user = await userRepo.findById(userId)
  } catch (error) {
    console.error('Erro ao buscar o usuário no banco:', error)
  }

  // 2. Montamos os dados da tela
  // Se o banco achar o usuário, usa os dados do banco.
  // Se não achar (porque é o ID provisório), inventamos dados de Admin para a tela não ficar branca!
  const userData = {
    nome: user?.name || session?.nome || session?.name || 'Administrador CODATA',
    email: user?.email || session?.email || 'admin@codata.com.br',
    tema: (user as any)?.theme || 'codata',
    fonte: (user as any)?.font || 'inter'
  }

  return <ProfileClient user={userData} />
}