import { createHmac, timingSafeEqual } from 'crypto'
import { env } from '@/core/config/env'

// Gera um token seguro para a URL da agenda
export function generateFeedToken(userId: string) {
  const signature = createHmac('sha256', env.sessionSecret)
    .update(userId)
    .digest('base64url')
  
  return `${userId}.${signature}`
}

// Verifica se o token é verdadeiro e devolve o ID do usuário
export function verifyFeedToken(token: string): string | null {
  const [userId, signature] = token.split('.')
  if (!userId || !signature) return null

  const expected = createHmac('sha256', env.sessionSecret)
    .update(userId)
    .digest('base64url')

  const a = Buffer.from(signature)
  const b = Buffer.from(expected)

  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  return userId
}