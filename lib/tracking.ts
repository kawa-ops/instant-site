'use client'

// Meta tracking helpers — browser side.
// Every event that must deduplicate with the server (CAPI) shares one
// eventId generated here and passed both to fbq() and to the admin API.

declare global {
  interface Window { fbq?: (...args: unknown[]) => void }
}

// A pixel id is public by design — the hardcoded fallback lets the
// campaign launch without waiting for a Vercel env-var deploy.
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '26406657245699531'

// Unique per-event id, shared browser <-> server (deduplication key)
export function newEventId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
  }
}

// Safe wrappers — no-op if the pixel is blocked or not loaded
export function fbTrack(eventName: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === 'undefined' || !window.fbq) return
  if (eventId) window.fbq('track', eventName, params || {}, { eventID: eventId })
  else window.fbq('track', eventName, params || {})
}

export function fbTrackCustom(eventName: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === 'undefined' || !window.fbq) return
  if (eventId) window.fbq('trackCustom', eventName, params || {}, { eventID: eventId })
  else window.fbq('trackCustom', eventName, params || {})
}

// _fbp / _fbc cookies — raw values, required server-side for match quality
export function getFbCookies(): { fbp: string | null; fbc: string | null } {
  if (typeof document === 'undefined') return { fbp: null, fbc: null }
  const read = (name: string) => {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return m ? decodeURIComponent(m[1]) : null
  }
  return { fbp: read('_fbp'), fbc: read('_fbc') }
}

// UTM persistence — a lead that arrived through an ad keeps its provenance
// across internal navigation (sessionStorage survives route changes)
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid']
const STORE_KEY = 'instant_utms'

export function captureUtms(): void {
  if (typeof window === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    const found: Record<string, string> = {}
    UTM_KEYS.forEach(k => { const v = params.get(k); if (v) found[k] = v })
    if (Object.keys(found).length > 0) {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(found))
    }
  } catch {}
}

export function getUtms(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}')
  } catch {
    return {}
  }
}

// Budget bracket -> numeric value for value-based optimisation.
// Strings MUST match the "Budget estimé" select labels exactly.
export function budgetToValue(budget?: string | null): number {
  switch ((budget || '').trim()) {
    case '< 1 000 €': return 1000
    case '1 000 – 3 000 €': return 3000
    case '3 000 – 8 000 €': return 8000
    case '8 000 – 20 000 €': return 20000
    case '> 20 000 €': return 40000
    case 'À définir ensemble': return 0
    default: return 0
  }
}
