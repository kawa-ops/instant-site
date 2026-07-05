const ADMIN_URL = process.env.ADMIN_URL || 'https://admin.instantmov.fr'

export type ContentMap = Record<string, string>

export async function getContent(): Promise<ContentMap> {
  try {
    const res = await fetch(`${ADMIN_URL}/api/content`, { cache: 'no-store' })
    if (!res.ok) return {}
    const blocks: Array<{ key: string; value: string }> = await res.json()
    return Object.fromEntries(blocks.map(b => [b.key, b.value]))
  } catch {
    return {}
  }
}

export function c(map: ContentMap, key: string, fallback = ''): string {
  return map[key] ?? fallback
}
