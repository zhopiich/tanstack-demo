let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function clearAccessToken(): void {
  accessToken = null
}

let unauthorizedHandler: (() => void) | null = null

export function onUnauthorized(callback: () => void): void {
  unauthorizedHandler = callback
}

export function notifyUnauthorized(): void {
  unauthorizedHandler?.()
}
