import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/core/config/env'
import { savePlannerTokens } from '@/modules/planner/infra/token-store'

type MicrosoftTokenResponse = {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope?: string
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const error = request.nextUrl.searchParams.get('error')
  const errorDescription = request.nextUrl.searchParams.get('error_description')

  if (error) {
    return NextResponse.json(
      { error, errorDescription },
      { status: 400 }
    )
  }

  if (!code) {
    return NextResponse.json(
      { error: 'Code não recebido no callback Microsoft.' },
      { status: 400 }
    )
  }

  const tokenUrl =
    `https://login.microsoftonline.com/${env.microsoftTenantId}` +
    '/oauth2/v2.0/token'

  const body = new URLSearchParams({
    client_id: env.microsoftClientId,
    client_secret: env.microsoftClientSecret,
    code,
    redirect_uri: env.microsoftRedirectUri,
    grant_type: 'authorization_code',
  })

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    const text = await response.text()
    return NextResponse.json(
      { error: 'Falha ao trocar code por token.', details: text },
      { status: 400 }
    )
  }

  const tokenData = (await response.json()) as MicrosoftTokenResponse

  await savePlannerTokens({
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresIn: tokenData.expires_in,
  })

  return NextResponse.redirect(new URL('/planner', request.url))
}