import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  const hashBuffer = Buffer.from(hash, 'hex')

  if (hashBuffer.length !== derivedKey.length) return false

  return timingSafeEqual(hashBuffer, derivedKey)
}