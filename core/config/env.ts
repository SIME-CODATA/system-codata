export const env = {
  mongodbUri: process.env.MONGODB_URI ?? '',
  sessionSecret: process.env.SESSION_SECRET ?? '',
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'CODATA Interno',

  microsoftTenantId: process.env.MICROSOFT_TENANT_ID ?? '',
  microsoftClientId: process.env.MICROSOFT_CLIENT_ID ?? '',
  microsoftClientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? '',
  microsoftRedirectUri: process.env.MICROSOFT_REDIRECT_URI ?? '',
}

if (!env.mongodbUri) throw new Error('MONGODB_URI não definida.')
if (!env.sessionSecret) throw new Error('SESSION_SECRET não definida.')

export const hasMicrosoftPlannerEnv =
  !!env.microsoftTenantId &&
  !!env.microsoftClientId &&
  !!env.microsoftClientSecret &&
  !!env.microsoftRedirectUri