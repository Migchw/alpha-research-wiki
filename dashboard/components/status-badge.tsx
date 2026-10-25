import { CheckCircle2, CircleDashed, ShieldQuestion, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/** Verification state always ships with an icon and a label, never colour alone. */
export function VerificationBadge({ value, className }: { value: string; className?: string }) {
  if (value === 'pending') {
    return <Badge variant="outline" className={cn('h-6 gap-1.5 border-pending/60 px-2 text-sm text-pending', className)}><CircleDashed aria-hidden />pending</Badge>;
  }
  if (value === 'verified') {
    return <Badge variant="outline" className={cn('h-6 gap-1.5 border-positive/50 px-2 text-sm text-positive', className)}><CheckCircle2 aria-hidden />verified</Badge>;
  }
  if (value === 'pass') {
    return <Badge variant="outline" className={cn('h-6 gap-1.5 border-positive/50 px-2 text-sm text-positive', className)}><CheckCircle2 aria-hidden />pass</Badge>;
  }
  if (value === 'fail') {
    return <Badge variant="outline" className={cn('h-6 gap-1.5 border-negative/50 px-2 text-sm text-negative', className)}><XCircle aria-hidden />fail</Badge>;
  }
  if (!value) return null;
  return <Badge variant="outline" className={cn('h-6 gap-1.5 px-2 text-sm text-muted-foreground', className)}><ShieldQuestion aria-hidden />{value}</Badge>;
}

/** Hypothesis lifecycle: idea → preregistered → testing → promoted | rejected (graveyard). Icon + label, never colour alone. */
export function HypothesisStatusBadge({ value, className }: { value: string; className?: string }) {
  const style: Record<string, string> = {
    idea: 'text-muted-foreground',
    preregistered: 'border-thesis/50 text-thesis',
    testing: 'border-primary/60 text-primary',
    promoted: 'border-positive/50 text-positive',
    rejected: 'border-negative/50 text-negative',
  };
  const Icon = value === 'promoted' ? CheckCircle2 : value === 'rejected' ? XCircle : CircleDashed;
  return <Badge variant="outline" className={cn('h-6 gap-1.5 px-2 text-sm', style[value] || 'text-muted-foreground', className)}><Icon aria-hidden />{value || 'idea'}</Badge>;
}

/** Note type, coloured the same way as the graph nodes (article ink, hypothesis amber, experiment blue, factor purple, concept green, paper grey). */
const kindStyle: Record<string, string> = {
  article: 'bg-foreground/10 text-foreground',
  hypothesis: 'bg-primary/15 text-primary',
  experiment: 'bg-thesis/15 text-thesis',
  factor: 'bg-chart-4/15 text-chart-4',
  concept: 'bg-chart-2/15 text-chart-2',
  paper: 'bg-muted text-muted-foreground',
  schema: 'bg-muted text-muted-foreground',
};

export function KindBadge({ label, kind, className }: { label: string; kind?: string; className?: string }) {
  return (
    <Badge variant="secondary" className={cn('h-6 rounded-md px-2 text-sm font-medium', kind && kindStyle[kind], className)}>
      {label}
    </Badge>
  );
}
