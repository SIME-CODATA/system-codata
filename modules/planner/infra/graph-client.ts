const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0'

type GraphRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  etag?: string
}

export async function graphRequest<T>(
  accessToken: string,
  path: string,
  options: GraphRequestOptions = {}
): Promise<T> {
  const response = await fetch(`${GRAPH_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.etag ? { 'If-Match': options.etag } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro Microsoft Graph: ${response.status} - ${errorText}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}