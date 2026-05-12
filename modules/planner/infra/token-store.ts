import { cookies } from 'next/headers'

export const PLANNER_ACCESS_TOKEN_COOKIE = 'planner_access_token'
export const PLANNER_REFRESH_TOKEN_COOKIE = 'planner_refresh_token'

export async function savePlannerTokens(input: {
  accessToken: string
  refreshToken?: string
  expiresIn: number
}) {
  const cookieStore = await cookies()

  cookieStore.set({
    name: PLANNER_ACCESS_TOKEN_COOKIE,
    value: input.accessToken,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.max(input.expiresIn - 60, 60),
  })

  if (input.refreshToken) {
    cookieStore.set({
      name: PLANNER_REFRESH_TOKEN_COOKIE,
      value: input.refreshToken,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
  }
}

export async function getPlannerAccessToken() {
  const cookieStore = await cookies()
  return cookieStore.get(PLANNER_ACCESS_TOKEN_COOKIE)?.value ?? null
}

export async function clearPlannerTokens() {
  const cookieStore = await cookies()

  cookieStore.set({
    name: PLANNER_ACCESS_TOKEN_COOKIE,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  cookieStore.set({
    name: PLANNER_REFRESH_TOKEN_COOKIE,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}