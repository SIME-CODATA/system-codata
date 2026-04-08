export const env = {
  mongodbUri: process.env.MONGODB_URI ?? '',
  sessionSecret: process.env.SESSION_SECRET ?? '',
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'CODATA Interno',
}

if (!env.mongodbUri) {
  throw new Error('MONGODB_URI não definida.')
}

if (!env.sessionSecret) {
  throw new Error('SESSION_SECRET não definida.')
}