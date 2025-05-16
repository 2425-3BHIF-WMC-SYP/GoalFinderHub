function getApiUrl(): string {
  let apiUrl: string

  if (import.meta.env.DEV) {
    apiUrl = 'http://localhost:3000/api'
  } else {
    apiUrl = 'http://goalfinderhub:3000/api'
  }

  return apiUrl
}

export async function fetchRestEndpoint(
  route: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: object,
): Promise<any> {
  const options: RequestInit = { method }

  const headers = new Headers()
  const jwt = sessionStorage.getItem('jwt')
  if (jwt !== null) {
    headers.append('Authorization', `Bearer ${jwt}`)
  }
  if (data) {
    headers.append('Content-Type', 'application/json')
    options.body = JSON.stringify(data)
  }
  options.headers = headers

  const apiUrl = getApiUrl()

  const res = await fetch(`${apiUrl}${route}`, options)

  if (!res.ok) {
    const message = await res.text()
    throw new Error(`${message}`)
  }
  if (res.status !== 204 ) {
    return await res.json();
  }
}
