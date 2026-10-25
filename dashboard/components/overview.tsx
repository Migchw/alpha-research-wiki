'use client';

import Link from 'next/link';
import { CircleDashed } from 'lucide-react';
import { LocalGraphCard } from '@/components/graph-explorer';
import type { WikiGraph } from '@/components/knowledge-graph';
import { Hero } from '@/components/hero';
import { StatStrip } from '@/components/stat-strip';
import { HypothesisStatusBadge, VerificationBadge } from '@/components/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExperimentRow, HypothesisRow, WikiIndex } from '@/lib/wiki';

type Props = {
  vaultName: string; generatedAt: string; stats: WikiIndex['stats'];
  hypotheses: HypothesisRow[]; experiments: ExperimentRow[]; graph: WikiGraph;
};

const stamp = (iso: string) => (iso ? `${new Date(iso).toISOString().slice(0, 16).replace('T', ' ')}Z` : '—');
const fixed = (value: number | null, digits = 2) => (value === null ? '—' : value.toFixed(digits));

export default function Overview({ vaultName, generatedAt, stats, hypotheses, experiments, graph }: Props) {
  const active = hypotheses.find((item) => item.status === 'testing') || hypotheses[0];
  const latest = [...experiments].sort((a, b) => b.runAt.localeCompare(a.runAt)).slice(0, 6);
  const pending = experiments.filter((item) => item.verdict === 'pending');

  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-8 px-4 py-6 sm:px-8 sm:py-8">
      <Hero vaultName={vaultName} indexedAt={generatedAt} />

      <StatStrip
        stats={[
          { label: 'Hypotheses', value: stats.hypotheses, hint: 'สมมติฐานทั้งหมด รวม graveyard' },
          { label: 'Experiments', value: stats.experiments, hint: 'ทุกการรัน = 1 trial' },
          { label: 'Papers', value: stats.papers, hint: 'source note ของงานวิจัย' },
          { label: 'รอ Reviewer', value: stats.pendingReview, hint: 'experiment ที่ verdict ยัง pending', tone: 'pending' },
        ]}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl">Hypotheses</CardTitle>
              <Link href="/board" className="text-base text-primary hover:underline">Research Board</Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {hypotheses.map((item) => (
              <Link key={item.slug} href={`/read/${item.slug}`} className="block border-b border-border px-5 py-4 transition-colors last:border-0 hover:bg-accent/50">
                <div className="flex items-center justify-between gap-2">
                  <span className="num text-sm text-muted-foreground">{item.id} · {item.experiments} trial</span>
                  <HypothesisStatusBadge value={item.status} />
                </div>
                <h3 className="mt-2 text-lg font-medium leading-snug">{item.title}</h3>
                <p className="num mt-1 text-sm text-muted-foreground">{item.signal} · {item.universe}</p>
              </Link>
            ))}
            {!hypotheses.length && <p className="px-5 py-8 text-base text-muted-foreground">ยังไม่มี hypothesis</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl">Experiment ล่าสุด</CardTitle>
              <Link href="/ledger" className="text-base text-primary hover:underline">Experiment Ledger</Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {latest.map((item) => (
              <Link key={item.slug} href={`/read/${item.slug}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-3 transition-colors last:border-0 hover:bg-accent/50">
                <span className="min-w-0">
                  <span className="num block text-base">{item.id} · {item.lookback} · {item.sample}</span>
                  <span className="num text-sm text-muted-foreground">trial {item.trialNo ?? '—'} · Sharpe {fixed(item.sharpe)} · t {fixed(item.tStat)}</span>
                </span>
                <VerificationBadge value={item.verdict} />
              </Link>
            ))}
            {!latest.length && <p className="px-5 py-8 text-base text-muted-foreground">ยังไม่มี experiment รัน `python scripts/backtest_momentum.py`</p>}
          </CardContent>
        </Card>
      </section>

      {pending.length > 0 && (
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl">ต้องให้ Reviewer ตรวจก่อนเชื่อ</CardTitle>
              <span className="num text-3xl text-pending">{pending.length}</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 p-5">
            {pending.map((item) => (
              <Link key={item.slug} href={`/read/${item.slug}`} className="num inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-base hover:border-pending/60">
                <CircleDashed className="size-4 text-pending" aria-hidden />{item.id}
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {active && <LocalGraphCard graph={graph} focus={active.slug} title={active.id} />}

      <footer className="flex flex-wrap justify-between gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
        <span className="num">wiki-index {stamp(generatedAt)}</span>
        <span>read-only: dashboard อ่าน vault อย่างเดียว ไม่แก้ไฟล์</span>
      </footer>
    </main>
  );
}
