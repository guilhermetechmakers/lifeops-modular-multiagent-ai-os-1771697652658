import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, Globe, Languages } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProfileInfo as ProfileInfoType } from '@/types/user-profile'
import { useUpdateProfileInfo } from '@/hooks/use-user-profile'

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
]

interface ProfileInfoProps {
  profileInfo?: ProfileInfoType
  isLoading?: boolean
}

export function ProfileInfo({ profileInfo, isLoading }: ProfileInfoProps) {
  const updateMutation = useUpdateProfileInfo()
  const [localInfo, setLocalInfo] = useState<ProfileInfoType>(
    profileInfo ?? {
      name: '',
      email: '',
      timezone: 'UTC',
      language: 'en',
    }
  )

  useEffect(() => {
    if (profileInfo) {
      setLocalInfo(profileInfo)
    }
  }, [profileInfo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(localInfo)
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const initials = localInfo.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-5 w-5 text-primary" />
          Profile Info
        </CardTitle>
        <CardDescription>
          Name, email, avatar, timezone and language preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Avatar className="h-16 w-16 rounded-full border-2 border-border transition-transform duration-200 hover:scale-105">
              <AvatarImage src={profileInfo?.avatar_url} alt={localInfo.name} />
              <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Avatar</Label>
              <Button type="button" variant="outline" size="sm" disabled>
                Change avatar (coming soon)
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={localInfo.name}
                onChange={(e) => setLocalInfo((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                className="transition-colors focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={localInfo.email}
                onChange={(e) => setLocalInfo((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="transition-colors focus:border-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Timezone
              </Label>
              <Select
                value={localInfo.timezone}
                onValueChange={(v) => setLocalInfo((p) => ({ ...p, timezone: v }))}
              >
                <SelectTrigger className="transition-colors focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Language
              </Label>
              <Select
                value={localInfo.language}
                onValueChange={(v) => setLocalInfo((p) => ({ ...p, language: v }))}
              >
                <SelectTrigger className="transition-colors focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
