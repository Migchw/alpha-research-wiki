'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { VerificationBadge } from '@/components/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { ExperimentRow } from '@/lib/wiki';

type SortKey = 'trialNo' | 'sharpe' | 'tStat' | 'annReturn' | 'maxDd';
const sortable: { key: SortKey; label: string }[] = [
  { key: 'trialNo', label: 'Trial' },
  { key: 'sharpe', label: 'Sharpe' },
  { key: 'tStat', label: 't-stat' },
  { key: 'annReturn', label: 'Ann. return' },
  { key: 'maxDd', label: 'Max DD' },
];
const samples = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'in_sample', label: 'in-sample' },
  { value: 'out_of_sample', label: 'out-of-sample' },
] as const;

const fixed = (value: number | null, digits = 2) => (value === null ? '—' : value.toFixed(digits));
const pct = (value: number | null) => (value === null ? '—' : `${(value * 100).toFixed(1)}%`);

/** Every run of every hypothesis, sortable by the metrics the backtest script wrote into frontmatter. */
export default function ExperimentLedger({ experiments }: { experiments: ExperimentRow[] }) {
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'trialNo', desc: false });
  const [sample, setSample] = useState<string>('all');

  const rows = useMemo(() => {
    const filtered = experiments.filter((row) => sample === 'all' || row.sample === sample);
    const value = (row: ExperimentRow) => row[sort.key];
    // Missing metrics (stubs) always sink to the bottom, whatever the direction.
    return [...filtered].sort((a, b) => {
      const x = value(a); const y = value(b);
      if (x === null && y === null) return a.id.localeCompare(b.id);
      if (x === null) return 1;
      if (y === null) return -1;
      return sort.desc ? y - x : x - y;
    });
  }, [experiments, sample, sort]);

  const toggle = (key: SortKey) => setSort((current) => (current.key === key ? { key, desc: !current.desc } : { key, desc: key !== 'trialNo' && key !== 'maxDd' }));

  return (
    <main className="mx-auto w-full max-w-[1700px] space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Experiment Ledger</h1>
          <p className="mt-2 max-w-3xl text-lg text-muted-foreground">
            ทุกการรันคือ 1 trial รวมตัวที่ผลแย่ ตัวเลขทั้งหมดมาจาก <code>scripts/backtest_momentum.py</code>
            กดหัวคอลัมน์เพื่อเรียง แต่อย่าลืมว่ายิ่งลองมาก Sharpe สูงสุดยิ่งเชื่อได้น้อยลง (deflated Sharpe, Module 8)
          </p>
        </div>
        <div role="group" aria-label="กรอง sample" className="flex rounded-lg border border-border p-1">
          {samples.map((item) => (
            <button key={item.value} onClick={() => setSample(item.value)} aria-pressed={sample === item.value}
              className={cn('rounded-md px-3 py-1 text-base text-muted-foreground transition-colors hover:text-foreground', sample === item.value && 'bg-accent text-foreground')}>
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="thin-scroll overflow-x-auto rounded-lg border border-border bg-card">
        <Table className="min-w-[60rem]">
          <TableHeader className="bg-secondary">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12 pl-5 text-base">Experiment</TableHead>
              <TableHead className="h-12 text-base">Hypothesis</TableHead>
              {sortable.map(({ key, label }) => {
                const Icon = sort.key !== key ? ArrowUpDown : sort.desc ? ArrowDown : ArrowUp;
                return (
                  <TableHead key={key} className="h-12 text-right text-base" aria-sort={sort.key === key ? (sort.desc ? 'descending' : 'ascending') : 'none'}>
                    <button onClick={() => toggle(key)} className={cn('inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 hover:text-foreground', sort.key === key && 'text-foreground')}>
                      {label}<Icon className="size-3.5" aria-hidden />
                    </button>
                  </TableHead>
                );
              })}
              <TableHead className="h-12 text-right text-base">Turnover</TableHead>
              <TableHead className="h-12 text-base">Config</TableHead>
              <TableHead className="h-12 text-base">Verdict</TableHead>
              <TableHead className="h-12 text-base">Known biases</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.slug}>
                <TableCell className="pl-5"><Link href={`/read/${row.slug}`} className="num text-base font-semibold hover:text-primary">{row.id}</Link></TableCell>
                <TableCell>{row.hypothesisSlug ? <Link href={`/read/${row.hypothesisSlug}`} className="num text-base hover:text-primary">{row.hypothesisId}</Link> : <span className="num text-muted-foreground">{row.hypothesisId || '—'}</span>}</TableCell>
                <TableCell className="num text-right text-base">{row.trialNo ?? '—'}</TableCell>
                <TableCell className={cn('num text-right text-base', row.sharpe !== null && (row.sharpe >= 0 ? 'text-positive' : 'text-negative'))}>{fixed(row.sharpe)}</TableCell>
                <TableCell className="num text-right text-base">{fixed(row.tStat)}</TableCell>
                <TableCell className="num text-right text-base">{pct(row.annReturn)}</TableCell>
                <TableCell className="num text-right text-base">{pct(row.maxDd)}</TableCell>
                <TableCell className="num text-right text-base">{pct(row.turnover)}</TableCell>
                <TableCell className="num text-sm text-muted-foreground">{row.lookback} · {row.sample}</TableCell>
                <TableCell><VerificationBadge value={row.verdict} /></TableCell>
                <TableCell className="num whitespace-normal text-sm text-muted-foreground">{row.knownBiases.join(', ') || '—'}</TableCell>
              </TableRow>
            ))}
            {!rows.length && <TableRow className="hover:bg-transparent"><TableCell colSpan={11} className="py-16 text-center text-lg text-muted-foreground">ยังไม่มี experiment ใน sample นี้</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
