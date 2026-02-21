import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Invalid email address'),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Language is required'),
})

type ProfileFormData = z.infer<typeof profileSchema>

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
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profileInfo?.name ?? '',
      email: profileInfo?.email ?? '',
      timezone: profileInfo?.timezone ?? 'UTC',
      language: profileInfo?.language ?? 'en',
    },
  })

  useEffect(() => {
    if (profileInfo) {
      setValue('name', profileInfo.name)
      setValue('email', profileInfo.email)
      setValue('timezone', profileInfo.timezone)
      setValue('language', profileInfo.language)
    }
  }, [profileInfo, setValue])

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data)
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

  const displayName = profileInfo?.name ?? ''
  const initials = displayName
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Avatar className="h-16 w-16 rounded-full border-2 border-border transition-transform duration-200 hover:scale-[1.02]">
              <AvatarImage src={profileInfo?.avatar_url} alt={profileInfo?.name ?? 'User avatar'} />
              <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Avatar</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled
                aria-label="Change avatar (coming soon)"
              >
                Change avatar (coming soon)
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                placeholder="Your name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('name')}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-timezone" className="flex items-center gap-2">
                <Globe className="h-4 w-4" aria-hidden />
                Timezone
              </Label>
              <Controller
                name="timezone"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="profile-timezone"
                      className="transition-colors duration-200 focus:ring-ring"
                      aria-invalid={!!errors.timezone}
                    >
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.timezone && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.timezone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-language" className="flex items-center gap-2">
                <Languages className="h-4 w-4" aria-hidden />
                Language
              </Label>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="profile-language"
                      className="transition-colors duration-200 focus:ring-ring"
                      aria-invalid={!!errors.language}
                    >
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.language && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.language.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="transition-all duration-200 hover:scale-[1.02] hover:shadow-card"
            aria-busy={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
