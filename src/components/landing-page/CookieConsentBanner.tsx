import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  hasUserConsented,
  acceptAll,
  rejectNonEssential,
  saveCustomConsent,
  getStoredConsent,
  type CookieConsentState,
} from '@/lib/cookie-consent'
import { Cookie, BarChart3, Megaphone, Settings2, Shield } from 'lucide-react'

const CATEGORY_LABELS: Record<keyof Pick<CookieConsentState, 'essential' | 'analytics' | 'marketing' | 'preferences'>, { label: string; description: string; icon: typeof Shield }> = {
  essential: {
    label: 'Essential',
    description: 'Required for the site to function. Cannot be disabled.',
    icon: Shield,
  },
  analytics: {
    label: 'Analytics',
    description: 'Help us understand how visitors use our site.',
    icon: BarChart3,
  },
  marketing: {
    label: 'Marketing',
    description: 'Used to deliver relevant ads and measure campaign performance.',
    icon: Megaphone,
  },
  preferences: {
    label: 'Preferences',
    description: 'Remember your settings and preferences across sessions.',
    icon: Settings2,
  },
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const [preferences, setPreferences] = useState<Pick<CookieConsentState, 'analytics' | 'marketing' | 'preferences'>>({
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    setVisible(!hasUserConsented())
  }, [])

  const handleAcceptAll = () => {
    acceptAll()
    setVisible(false)
  }

  const handleRejectNonEssential = () => {
    rejectNonEssential()
    setVisible(false)
  }

  const handleCustomizeOpen = () => {
    const stored = getStoredConsent()
    setPreferences({
      analytics: stored?.analytics ?? false,
      marketing: stored?.marketing ?? false,
      preferences: stored?.preferences ?? false,
    })
    setCustomizeOpen(true)
  }

  const handleCustomizeSave = () => {
    saveCustomConsent(preferences)
    setVisible(false)
    setCustomizeOpen(false)
  }

  const handleCustomizeReject = () => {
    rejectNonEssential()
    setVisible(false)
    setCustomizeOpen(false)
  }

  if (!visible) return null

  return (
    <>
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6',
          'animate-slide-up'
        )}
        role="dialog"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
      >
        <div
          className={cn(
            'mx-auto max-w-4xl rounded-2xl border border-border',
            'bg-card/95 backdrop-blur-xl shadow-card',
            'p-6 sm:p-8'
          )}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 id="cookie-consent-title" className="text-lg font-semibold text-foreground">
                  We value your privacy
                </h2>
                <p id="cookie-consent-description" className="mt-1 text-sm text-muted-foreground">
                  We use cookies to improve your experience, analyze traffic, and personalize content. You can choose which categories to allow.
                </p>
                <Link
                  to="/cookies"
                  className="mt-2 inline-block text-sm text-primary hover:underline"
                >
                  Learn more in our Cookie Policy
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
              <Button
                onClick={handleRejectNonEssential}
                variant="ghost"
                size="sm"
                className="hover:bg-muted"
              >
                Reject Non-Essential
              </Button>
              <Button
                onClick={handleCustomizeOpen}
                variant="outline"
                size="sm"
                className="border-2"
              >
                Customize
              </Button>
              <Button
                onClick={handleAcceptAll}
                size="sm"
                className="shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent className="max-w-lg" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Cookie preferences
            </DialogTitle>
            <DialogDescription>
              Choose which cookie categories you want to allow. Essential cookies are always enabled.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {(['analytics', 'marketing', 'preferences'] as const).map((key) => {
              const { label, description, icon: Icon } = CATEGORY_LABELS[key]
              return (
                <div
                  key={key}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                    <div>
                      <Label htmlFor={`cookie-${key}`} className="font-medium text-foreground">
                        {label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{description}</p>
                    </div>
                  </div>
                  <Switch
                    id={`cookie-${key}`}
                    checked={preferences[key]}
                    onCheckedChange={(checked) =>
                      setPreferences((p) => ({ ...p, [key]: checked }))
                    }
                  />
                </div>
              )
            })}
          </div>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <Button variant="ghost" onClick={handleCustomizeReject}>
              Reject Non-Essential
            </Button>
            <Button onClick={handleCustomizeSave}>
              Save preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
