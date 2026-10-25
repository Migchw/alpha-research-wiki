import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { KindBadge } from '@/components/status-badge';
import { wiki } from '@/lib/wiki-data';

export const metadata: Metadata = {
  title: 'บทความ · Alpha Research Desk',
  description: 'บทความอธิบาย paper และรายงานวิจัยแบบอ่านเข้าใจ',
};

export default function ArticlesPage() {
  const titleOf = new Map(wiki.documents.map((doc) => [doc.slug, doc]));
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      <header>
        <h1 className="text-4xl">บทความ</h1>
        <p className="mt-2 max-w-3xl text-lg text-muted-foreground">
          เริ่มอ่านจากตรงนี้ บทความอธิบาย paper และงานวิจัยของเราแบบเล่าเป็นเรื่อง ส่วนโน้ตใน paper / hypothesis /
          experiment คือบันทึกสั้นที่ใช้ตรวจสอบและอ้างอิง
        </p>
      </header>
      <ul className="grid gap-4">
        {wiki.research.articles.map((article) => (
          <li key={article.slug}>
            <Link href={`/read/${article.slug}`} className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/60 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="size-4 text-primary" aria-hidden />
                {article.readMin && <span className="num">อ่าน {article.readMin} นาที</span>}
                {article.basis && <span className="num">· {article.basis}</span>}
                {article.status === 'draft' && <span className="rounded-md border border-pending/60 px-2 text-pending">draft</span>}
              </div>
              <h2 className="mt-2 text-2xl leading-snug group-hover:text-primary">{article.title}</h2>
              {article.brief && <p className="mt-2 text-base leading-relaxed text-muted-foreground">{article.brief}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {article.about.map((slug) => {
                  const doc = titleOf.get(slug);
                  return doc ? <span key={slug} className="inline-flex items-center gap-1.5 text-sm"><KindBadge label={doc.kind.toUpperCase()} kind={doc.kind} className="h-5 text-xs" />{doc.group || doc.title}</span> : null;
                })}
              </div>
            </Link>
          </li>
        ))}
        {!wiki.research.articles.length && <li className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">ยังไม่มีบทความใน <code>articles/</code></li>}
      </ul>
    </main>
  );
}
