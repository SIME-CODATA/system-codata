import { NextResponse } from 'next/server'
import { getPlannerAccessToken } from '@/modules/planner/infra/token-store'
import { importAllPlannerData } from '@/modules/planner/application/import-all'

export async function POST() {
  const accessToken = await getPlannerAccessToken()

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Planner não autenticado.' },
      { status: 401 }
    )
  }

  try {
    const result = await importAllPlannerData(accessToken)

    return NextResponse.json({
      ok: true,
      ...result,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Falha ao sincronizar Planner.',
      },
      { status: 500 }
    )
  }
}