import mongoose from 'mongoose'
import { env } from '@/core/config/env'

declare global {
  var __mongoose__: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}

const cached = global.__mongoose__ ?? {
  conn: null,
  promise: null,
}

export async function connectMongo() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.mongodbUri)
  }

  cached.conn = await cached.promise
  global.__mongoose__ = cached

  return cached.conn
}