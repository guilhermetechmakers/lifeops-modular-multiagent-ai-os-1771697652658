import { useRef, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ManualCodeInputProps {
  onVerify: (code: string) => void
  isPending: boolean
  error?: string | null
  className?: string
}

const CODE_LENGTH = 6

export function ManualCodeInput({
  onVerify,
  isPending,
  error,
  className,
}: ManualCodeInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = useCallback(
    (index: number, value: string) => {
      const char = value.replace(/\D/g, '').slice(-1)
      const next = [...digits]
      next[index] = char
      setDigits(next)

      if (char && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      const full = next.join('')
      if (full.length === CODE_LENGTH) {
        onVerify(full)
      }
    },
    [digits, onVerify]
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
        const next = [...digits]
        next[index - 1] = ''
        setDigits(next)
      }
    },
    [digits]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
      const next = Array(CODE_LENGTH).fill('')
      pasted.split('').forEach((c, i) => { next[i] = c })
      setDigits(next)
      const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1)
      inputRefs.current[focusIdx]?.focus()
      if (pasted.length === CODE_LENGTH) {
        onVerify(pasted)
      }
    },
    [onVerify]
  )

  const code = digits.join('')
  const canSubmit = code.length === CODE_LENGTH && !isPending

  return (
    <div className={cn('space-y-4', className)}>
      <p className="text-sm text-muted-foreground">
        Can&apos;t click the link? Enter the 6-digit code from the email:
      </p>
      <div
        className="flex gap-2 justify-center"
        onPaste={handlePaste}
      >
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <Input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={cn(
              'h-12 w-12 text-center text-xl font-semibold tracking-widest',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
            aria-label={`Digit ${i + 1} of 6`}
            disabled={isPending}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive text-center animate-fade-in">
          {error}
        </p>
      )}
      <Button
        type="button"
        onClick={() => onVerify(code)}
        disabled={!canSubmit}
        className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        {isPending ? 'Verifying...' : 'Verify code'}
      </Button>
    </div>
  )
}
