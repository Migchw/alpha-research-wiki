import Link from 'next/link';
import { Skull } from 'lucide-react';
import { HypothesisStatusBadge } from '@/components/status-badge';
import { cn } from '@/lib/utils';
import type { HypothesisRow } from '@/lib/wiki';

const columns = [
  { status: 'idea', label: 'Idea', hint: 'ยังไม่ pre-register' },
  { status: 'preregistered', label: 'Pre-registered', hint: 'ล็อก signal + kill criteria แล้ว' },
  { status: 'testing', label: 'Testing', hint: 'มี experiment แล้ว' },
  { status: 'promoted', label: 'Promoted', hint: 'ผ่าน Reviewer → factor' },
  { status: 'rejected', label: 'Graveyard', hint: 'ไม่รอด เก็บไว้พร้อมเหตุผล' },
] as const;

/** Hypotheses by lifecycle status; the graveyard is a status, so rejected notes stay visible with their reason. */
export default function ResearchBoard({ hypotheses }: { hypotheses: HypothesisRow[] }) {
  return (
    <main className="mx-auto w-full max-w-[1800px] space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      <header>
        <h1 className="text-4xl">Research Board</h1>
        <p className="mt-2 max-w-3xl text-lg text-muted-foreground">
          สมมติฐานทุกตัวแยกตามสถานะ ตัวที่ไม่รอดย้ายไป Graveyard พร้อม <code>rejected_reason</code> ไม่ถูกลบ
          เพื่อให้เห็นว่าเคยลองอะไรไปแล้วกี่ครั้ง
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {columns.map((column) => {
          const items = hypotheses.filter((item) => (item.status || 'idea') === column.status);
          const graveyard = column.status === 'rejected';
          return (
            <section key={column.status} aria-labelledby={`col-${column.status}`} className={cn('flex min-h-48 flex-col rounded-lg border border-border bg-card', graveyard && 'border-dashed bg-muted/40')}>
              <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
                <div>
                  <h2 id={`col-${column.status}`} className="flex items-center gap-2 text-xl">
                    {graveyard && <Skull className="size-4 text-muted-foreground" aria-hidden />}{column.label}
                  </h2>
                  <p className="text-sm text-muted-foreground">{column.hint}</p>
                </div>
                <span className="num text-2xl text-muted-foreground">{items.length}</span>
              </div>
              <ul className="flex-1 space-y-3 p-3">
                {items.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/read/${item.slug}`} className="block rounded-md border border-border bg-background p-3 outline-none transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring">
                      <div className="flex items-center justify-between gap-2">
                        <span className="num text-sm font-bold">{item.id}</span>
                        <HypothesisStatusBadge value={item.status} />
                      </div>
                      <p className="mt-2 text-base font-medium leading-snug">{item.title}</p>
                      <p className="num mt-2 text-sm text-muted-foreground">{item.experiments} trial · {item.universe}</p>
                      {graveyard && (
                        <p className="mt-2 rounded-md bg-negative/10 px-2 py-1.5 text-sm text-negative">
                          {item.rejectedReason || 'ไม่มี rejected_reason (lint จะ fail)'}
                        </p>
                      )}
                      {!graveyard && item.killCriteria && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">Kill: {item.killCriteria}</p>}
                    </Link>
                  </li>
                ))}
                {!items.length && <li className="px-2 py-6 text-center text-sm text-muted-foreground">ว่าง</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
