import { NextResponse } from 'next/server'
import { env } from '@/core/config/env'

const SCOPES = [
  'offline_access',
  'User.Read',
  'Group.Read.All',
  'Tasks.ReadWrite',
].join(' ')

export async function GET() {
  const params = new URLSearchParams({
    client_id: env.microsoftClientId,
    response_type: 'code',
    redirect_uri: env.microsoftRedirectUri,
    response_mode: 'query',
    scope: SCOPES,
  })

  const url =
    `https://login.microsoftonline.com/${env.microsoftTenantId}` +
    `/oauth2/v2.0/authorize?${params.toString()}`

  return NextResponse.redirect(url)
}