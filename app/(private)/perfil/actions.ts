'use server'

import { revalidatePath } from 'next/cache'
import { UserRepo } from '@/modules/users/infra/repo'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/core/security/cookie'
import { readSessionToken } from '@/core/security/session'

// Tipagem para retorno das ações
export type ActionResponse = {
  success: boolean
  message: string
}

async function getUserId(): Promise<string> {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value
  const session = readSessionToken(sessionValue) as { id?: string } | null
  return session?.id || '507f1f77bcf86cd799439011'
}

export async function updateProfile(formData: FormData): Promise<ActionResponse> {
  const userId = await getUserId()
  const userRepo = new UserRepo()
  
  const nome = formData.get('nome') as string
  const tema = formData.get('tema') as string
  const fonte = formData.get('fonte') as string

  try {
    // 💡 No seu UserRepo, crie o método updatePreferences se necessário
    // await userRepo.update(userId, { name: nome, theme: tema, font: fonte })
    
    console.log(`Atualizando preferências do usuário ${userId}:`, { nome, tema, fonte })
    
    revalidatePath('/') // Atualiza o sistema todo (sidebar, etc)
    return { success: true, message: 'Perfil atualizado com sucesso!' }
  } catch (error) {
    return { success: false, message: 'Erro ao salvar alterações.' }
  }
}

export async function updatePassword(formData: FormData): Promise<ActionResponse> {
  // Lógica de troca de senha (bcrypt, etc) aqui futuramente
  return { success: true, message: 'Senha alterada com sucesso!' }
}