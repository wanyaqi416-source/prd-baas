import { cn } from '../../lib/utils'

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-auto rounded-2xl border">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}

export function TableHeader(props) {
  return <thead className="[&_tr]:border-b" {...props} />
}

export function TableBody(props) {
  return <tbody className="[&_tr:last-child]:border-0" {...props} />
}

export function TableRow({ className, ...props }) {
  return <tr className={cn('border-b transition-colors hover:bg-muted/50', className)} {...props} />
}

export function TableHead({ className, ...props }) {
  return <th className={cn('h-11 px-4 text-left align-middle font-semibold text-muted-foreground', className)} {...props} />
}

export function TableCell({ className, ...props }) {
  return <td className={cn('px-4 py-3 align-top', className)} {...props} />
}
