import { Alert } from '../ui/alert'

export function GuardrailAlert({ children, variant = 'default' }) {
  return (
    <Alert variant={variant} className={variant === 'destructive' ? 'border-l-4' : 'border-l-4'}>
      {children}
    </Alert>
  )
}
