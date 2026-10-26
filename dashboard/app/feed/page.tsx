import type { Metadata } from 'next';
import { ExternalLink, Rss } from 'lucide-react';
import { CopyCommand } from '@/components/copy-command';
import { dateLabel } from '@/lib/wiki';
import { wiki } from '@/lib/wiki-data';

export const metadata: Metadata = {
  title: 'Paper Feed · Alpha Research Desk',
  description: 'paper ใหม่จาก ML-Quant เพื่อหาไอเดียงานวิจัย',
};

export default function FeedPage() {
  const feed = wiki.paperFeed;
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      <header>
        <h1 className="text-4xl">Paper Feed</h1>
        <p className="mt-2 max-w-3xl text-lg text-muted-foreground">
          paper ใหม่สำหรับหาไอเดีย สรุปหนึ่งประโยคเป็นของ ML-Quant ยังไม่ได้ตรวจกับต้นฉบับ ห้ามอ้างจนกว่าจะผ่าน
          <code className="mx-1">/find-paper</code> และ <code className="mx-1">/ingest-paper</code>
        </p>
        {feed && (
          <p className="mt-2 text-sm text-muted-foreground">
            หัวข้อ {feed.topic} · ดึงเมื่อ {dateLabel(feed.fetchedAt)} · {feed.items.length} paper ·{' '}
            <a href="https://www.ml-quant.com" className="underline hover:text-primary">{feed.credit}</a>
          </p>
        )}
      </header>

      {!feed && (
        <div className="rounded-lg border border-dashed border-border p-8 text-muted-foreground">
          <p className="flex items-center gap-2 text-lg text-foreground"><Rss className="size-5 text-primary" aria-hidden />ยังไม่มี feed</p>
          <p className="mt-2">dashboard ไม่ดึงข้อมูลจากเน็ตเอง ให้รันที่ root ของ repo แล้วรัน <code>npm run index</code> ใหม่</p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-muted p-3 text-sm"><code>python scripts/paper_feed.py --topic asset-pricing-factors --limit 20</code></pre>
        </div>
      )}

      {feed && (
        <ul className="grid gap-4">
          {feed.items.map((item) => (
            <li key={item.mlquant_url} className="rounded-lg border border-border bg-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="rounded-md border border-border px-2">{item.venue}</span>
                {item.released && <span className="num">ออก {dateLabel(item.released)}</span>}
                {item.inVault && <span className="rounded-md border border-primary/60 px-2 text-primary">มีใน vault แล้ว</span>}
              </div>
              <h2 className="mt-2 text-xl leading-snug">{item.title}</h2>
              {item.authors.length > 0 && <p className="mt-1 text-sm text-muted-foreground">{item.authors.join(', ')}</p>}
              {item.summary && (
                <p className="mt-2 text-base leading-relaxed">
                  {item.summary} <span className="text-sm text-muted-foreground">(สรุปโดย ML-Quant)</span>
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                {item.source_url && (
                  <a href={item.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline hover:text-primary">
                    <ExternalLink className="size-3.5" aria-hidden />abstract ({item.identifier || item.venue})
                  </a>
                )}
                <a href={item.mlquant_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline hover:text-primary">
                  <ExternalLink className="size-3.5" aria-hidden />ML-Quant
                </a>
                {!item.inVault && <CopyCommand command={`/find-paper "${item.title}" ${item.source_url}`} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
