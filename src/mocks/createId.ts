export default function createId(length: number = 25): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(length - 1)
  crypto.getRandomValues(array)

  return `c${Array.from(array, x => chars[x % chars.length]).join('')}`
}
