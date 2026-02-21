/**
 * Cookie consent types and utilities for GDPR-compliant consent management.
 */

export const COOKIE_CONSENT_STORAGE_KEY = 'lifeops_cookie_consent'

export type CookieCategory = 'essential' | 'analytics' | 'marketing' | 'preferences'

export interface CookieConsentState {
  essential: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
  timestamp: number
  version: number
}

export const DEFAULT_CONSENT: CookieConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: 0,
  version: 1,
}

export const ACCEPT_ALL_CONSENT: CookieConsentState = {
  essential: true,
  analytics: true,
  marketing: true,
  preferences: true,
  timestamp: Date.now(),
  version: 1,
}

export const REJECT_NON_ESSENTIAL_CONSENT: CookieConsentState = {
  ...DEFAULT_CONSENT,
  timestamp: Date.now(),
}

export function getStoredConsent(): CookieConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CookieConsentState
    return parsed.version === 1 ? parsed : null
  } catch {
    return null
  }
}

export function hasUserConsented(): boolean {
  return getStoredConsent() !== null
}

export function saveConsent(state: CookieConsentState): void {
  if (typeof window === 'undefined') return
  try {
    const toSave = { ...state, timestamp: Date.now(), version: 1 }
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    // Ignore storage errors
  }
}

export function acceptAll(): void {
  saveConsent(ACCEPT_ALL_CONSENT)
}

export function rejectNonEssential(): void {
  saveConsent(REJECT_NON_ESSENTIAL_CONSENT)
}

export function saveCustomConsent(partial: Partial<Pick<CookieConsentState, 'analytics' | 'marketing' | 'preferences'>>): void {
  const current = getStoredConsent() ?? DEFAULT_CONSENT
  saveConsent({
    ...current,
    ...partial,
    essential: true,
  })
}
