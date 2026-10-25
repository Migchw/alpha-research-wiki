import Link from 'next/link';
import { ArrowRight, BookOpen, Database, FlaskConical, Play, Scale, ShieldCheck } from 'lucide-react';
import { HypothesisStatusBadge, KindBadge, VerificationBadge } from '@/components/status-badge';
import { cn } from '@/lib/utils';
import type { ArticleRow, ExperimentRow, HypothesisRow, WikiDoc } from '@/lib/wiki';

/**
 * Plain-language context above a note, built only from frontmatter and the index.
 * Notes stay short and machine-checkable; this panel answers "what is this, where does the data come from,
 * and how do I read it" for a general reader. It never types result numbers by hand.
 */

const fixed = (value: number | null, digits = 2) => (value === null ? '—' : value.toFixed(digits));
const pct = (value: number | null) => (value === null ? '—' : `${(value * 100).toFixed(1)}%`);

const lookbackText: Record<string, { short: string; long: string }> = {
  '12-1': {
    short: 'ผลตอบแทน 11 เดือน ข้ามเดือนล่าสุด',
    long: 'ดูว่าหุ้นแต่ละตัวขึ้นหรือลงมากแค่ไหนในช่วงเดือนที่ 12 ถึงเดือนที่ 2 ก่อนหน้า แล้วข้ามเดือนล่าสุดไป 1 เดือน เพราะหุ้นที่เพิ่งวิ่งแรงในเดือนเดียวมักย่อตัวกลับในเดือนถัดไป (นี่คือสูตร momentum มาตรฐานที่งานวิจัยส่วนใหญ่ใช้)',
  },
  '12-7': {
    short: 'ผลตอบแทนช่วงเดือนที่ 12 ถึง 7 ก่อนหน้า',
    long: 'ดูเฉพาะผลงานของหุ้นในช่วงเดือนที่ 12 ถึงเดือนที่ 7 ก่อนหน้า และไม่สนใจครึ่งปีล่าสุดเลย ตามข้อเสนอของ Novy-Marx (2012) ว่า momentum มาจากผลงานช่วงกลางนี้เป็นหลัก',
  },
};

const sampleText: Record<string, string> = {
  in_sample: 'in-sample คือช่วงข้อมูลที่ใช้ทดลองและปรับความเข้าใจ',
  out_of_sample: 'out-of-sample คือช่วงข้อมูลที่กันไว้ไม่แตะจนกว่า in-sample จะผ่าน Reviewer ใช้ตัดสินว่าผลยังอยู่ไหมเมื่อเจอข้อมูลใหม่',
};

function windowLabel(range: string) {
  const [start, end] = range.split('..');
  return start && end ? `${start} ถึง ${end}` : range || 'ไม่ระบุ';
}

function Panel({ title, icon: Icon, children, className }: { title: string; icon: typeof BookOpen; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-lg border border-border bg-card p-5 sm:p-6', className)}>
      <h2 className="flex items-center gap-2 text-xl"><Icon className="size-5 text-primary" aria-hidden />{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-[var(--prose)]">{children}</div>
    </section>
  );
}

function Metric({ label, value, meaning }: { label: string; value: string; meaning: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="num mt-1 text-2xl">{value}</p>
      <p className="mt-1 text-sm leading-snug text-muted-foreground">{meaning}</p>
    </div>
  );
}

function ArticleLinks({ articles }: { articles: ArticleRow[] }) {
  if (!articles.length) return null;
  return (
    <div className="grid gap-2">
      {articles.map((article) => (
        <Link key={article.slug} href={`/read/${article.slug}`} className="group flex items-start gap-3 rounded-md border border-primary/40 bg-primary/5 p-4 hover:border-primary">
          <BookOpen className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-lg font-medium leading-snug group-hover:text-primary">{article.title}</span>
            {article.brief && <span className="mt-1 line-clamp-2 block text-base text-muted-foreground">{article.brief}</span>}
            <span className="num mt-1 block text-sm text-muted-foreground">{article.readMin ? `อ่านประมาณ ${article.readMin} นาที · ` : ''}{article.basis}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function ExperimentLedgerMini({ rows }: { rows: ExperimentRow[] }) {
  if (!rows.length) return <p className="text-muted-foreground">ยังไม่มี experiment</p>;
  return (
    <div className="thin-scroll overflow-x-auto rounded-md border border-border">
      <table className="ledger-mini w-full min-w-[34rem] text-left text-base">
        <thead className="bg-secondary text-sm text-muted-foreground">
          <tr><th className="px-3 py-2">Experiment</th><th className="px-3 py-2">สูตร · ช่วงข้อมูล</th><th className="px-3 py-2 text-right">Sharpe</th><th className="px-3 py-2 text-right">t-stat</th><th className="px-3 py-2 text-right">ต่อปี</th><th className="px-3 py-2">Reviewer</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.slug} className="border-t border-border">
              <td className="px-3 py-2"><Link href={`/read/${row.slug}`} className="num font-semibold hover:text-primary">{row.id}</Link></td>
              <td className="num px-3 py-2 text-sm text-muted-foreground">{row.lookback} · {row.sample}</td>
              <td className="num px-3 py-2 text-right">{fixed(row.sharpe)}</td>
              <td className="num px-3 py-2 text-right">{fixed(row.tStat)}</td>
              <td className="num px-3 py-2 text-right">{pct(row.annReturn)}</td>
              <td className="px-3 py-2"><VerificationBadge value={row.verdict} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExperimentContext({ row, hypothesis }: { row: ExperimentRow; hypothesis?: HypothesisRow }) {
  const lookback = lookbackText[row.lookback];
  const window = hypothesis ? (row.sample === 'out_of_sample' ? hypothesis.outOfSample : hypothesis.inSample) : '';
  const forced = row.knownBiases.includes('oos-before-review');
  return (
    <div className="mb-6 space-y-4">
      <Panel title="experiment นี้ทดสอบอะไร" icon={FlaskConical}>
        <p>
          คำถามคือ ถ้าทุกสิ้นเดือนเรา<b>ซื้อหุ้นกลุ่มที่ราคาขึ้นมากที่สุด</b> และ<b>ขายชอร์ตกลุ่มที่ขึ้นน้อยที่สุด</b>ใน {hypothesis?.universe || 'SET100'}
          {' '}แล้วถือไว้ 1 เดือน ทำซ้ำทุกเดือนตั้งแต่ {windowLabel(window)} พอร์ตนี้จะทำกำไรได้จริงไหมหลังหักค่าธรรมเนียม
        </p>
        <p><b>วิธีวัดว่าหุ้นไหน &ldquo;ขึ้นมาก&rdquo; ({row.lookback}):</b> {lookback?.long || row.lookback}</p>
        <p className="text-muted-foreground">{sampleText[row.sample] || row.sample}{hypothesis && <> · เป็นส่วนหนึ่งของ <Link href={`/read/${hypothesis.slug}`} className="text-primary hover:underline">{hypothesis.id}</Link> (trial ที่ {row.trialNo ?? '—'} ของสมมติฐานนี้)</>}</p>
        {forced && <p className="rounded-md bg-pending/10 px-3 py-2 text-pending">รอบนี้รัน out-of-sample ก่อน in-sample ผ่าน Reviewer และเปิดเผยไว้แล้วในโน้ต (known bias: oos-before-review)</p>}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="ข้อมูลมาจากไหน" icon={Database}>
          <ul className="list-disc space-y-2 pl-5">
            <li><b>ราคาหุ้น</b> จาก Yahoo Finance ผ่านไลบรารี Python ชื่อ <code>yfinance</code> ใช้ราคาที่ปรับปันผลและการแตกพาร์แล้ว (adjusted) แปลงเป็นราคาปิดสิ้นเดือน</li>
            <li><b>รายชื่อหุ้น</b> 100 ตัวใน <code>scripts/set100.txt</code> คือรายชื่อ SET100 <b>ปัจจุบัน</b> แล้วใช้ย้อนหลังทั้งช่วง หุ้นที่เคยอยู่แต่หลุดหรือเพิกถอนไปแล้วจึงไม่อยู่ในตัวอย่าง (survivorship bias ตั้งใจเก็บไว้ให้ Reviewer จับ)</li>
            <li>ไฟล์ราคาที่ดาวน์โหลดเก็บไว้ในเครื่อง (<code>data/</code>) ไม่ได้อยู่ใน repo</li>
          </ul>
        </Panel>
        <Panel title="ทำอะไรกับข้อมูลบ้าง" icon={Scale}>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>ทุกสิ้นเดือน คำนวณผลตอบแทนย้อนหลังของหุ้นทุกตัวตามสูตร {row.lookback}</li>
            <li>เรียงหุ้นจากน้อยไปมาก แบ่งเป็น 5 กลุ่มเท่าๆ กัน (quintile)</li>
            <li>ซื้อกลุ่มบนสุด (Q5) และขายชอร์ตกลุ่มล่างสุด (Q1) ด้วยเงินเท่ากันทุกตัว</li>
            <li>ถือ 1 เดือน แล้วหักค่าธรรมเนียม 30 bps (0.30%) ทุกครั้งที่ซื้อขาย</li>
            <li>ทำซ้ำทุกเดือน แล้วสรุปผลตอบแทนทั้งช่วงเป็นตัวเลขด้านล่าง</li>
          </ol>
        </Panel>
      </div>

      <Panel title="อ่านตัวเลขยังไง" icon={ShieldCheck}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Sharpe ratio" value={fixed(row.sharpe)} meaning="ผลตอบแทนเทียบกับความผันผวนต่อปี ยิ่งสูงยิ่งคุ้มความเสี่ยง ติดลบแปลว่าขาดทุน" />
          <Metric label="t-stat" value={fixed(row.tStat)} meaning="ผลตอบแทนเฉลี่ยห่างจากศูนย์แค่ไหนเมื่อเทียบกับความแกว่ง โดยทั่วไปต่ำกว่า 2 ยังแยกจากโชคได้ยาก" />
          <Metric label="ผลตอบแทนต่อปี" value={pct(row.annReturn)} meaning="ผลตอบแทนทบต้นเฉลี่ยต่อปีของพอร์ต long-short หลังหักค่าธรรมเนียม" />
          <Metric label="Max drawdown" value={pct(row.maxDd)} meaning="ช่วงที่พอร์ตขาดทุนจากจุดสูงสุดลึกที่สุด บอกว่าต้องทนเจ็บแค่ไหน" />
        </div>
        <p className="text-muted-foreground">
          ตัวเลขทั้งหมดคำนวณโดยสคริปต์และเขียนลงไฟล์อัตโนมัติ ไม่มีใครพิมพ์เอง · สถานะ Reviewer: <VerificationBadge value={row.verdict} className="align-middle" />
          {row.verdict === 'pending' && ' ยังไม่ควรเชื่อผลนี้จนกว่า Reviewer จะตรวจ'}
        </p>
      </Panel>

      <Panel title="ต้องรัน Python เองไหม" icon={Play}>
        <p>ไม่ต้อง ถ้าแค่อยากอ่านผล ทุกอย่างอยู่ในหน้านี้แล้ว ถ้าอยากรันซ้ำเพื่อตรวจเอง มี 2 ทาง</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li><b>Google Colab</b> (ไม่ต้องติดตั้งอะไร): เปิด <code>notebooks/backtest_momentum.ipynb</code> แล้วกด Run all</li>
          <li><b>Terminal</b> ในเครื่อง (ใส่ <code>--dry-run</code> เพื่อดูผลโดยไม่สร้าง trial ใหม่):</li>
        </ul>
        <pre className="thin-scroll overflow-x-auto rounded-md bg-secondary px-4 py-3 text-sm"><code>{`pip install -r requirements.txt\npython scripts/backtest_momentum.py --hypothesis ${row.hypothesisId || 'H-001'} --lookback ${row.lookback} --sample ${row.sample}${forced ? ' --force-oos' : ''} --dry-run`}</code></pre>
      </Panel>

      <h2 className="pt-2 text-2xl">รายงานที่สคริปต์เขียน</h2>
    </div>
  );
}

function HypothesisContext({ row, experiments, papers, articles }: { row: HypothesisRow; experiments: ExperimentRow[]; papers: Pick<WikiDoc, 'slug' | 'title' | 'group'>[]; articles: ArticleRow[] }) {
  const pending = experiments.filter((item) => item.verdict === 'pending').length;
  const steps = [
    { label: 'Paper ต้นทาง', detail: `${papers.length} ชิ้น`, done: papers.length > 0 },
    { label: 'Pre-register', detail: 'ล็อกสูตร + เกณฑ์ตัดทิ้ง', done: row.status !== 'idea' },
    { label: 'Backtest', detail: `${experiments.length} trial`, done: experiments.length > 0 },
    { label: 'Reviewer', detail: pending ? `รอตรวจ ${pending}` : 'ตรวจครบ', done: experiments.length > 0 && pending === 0 },
    { label: 'ตัดสิน', detail: row.status === 'promoted' ? 'เป็น factor' : row.status === 'rejected' ? 'Graveyard' : 'ยังไม่ตัดสิน', done: row.status === 'promoted' || row.status === 'rejected' },
  ];
  return (
    <div className="mb-6 space-y-4">
      <ArticleLinks articles={articles} />
      <Panel title="สมมติฐานนี้คืออะไร" icon={FlaskConical}>
        <p>
          <b>{row.id}</b> ถามว่า สูตรคัดหุ้นแบบ momentum ที่ได้ผลในตลาดสหรัฐ ใช้กับหุ้นไทยใน {row.universe} ได้ไหม
          โดยเฉพาะสูตร <b>{row.signal}</b>
        </p>
        <p>
          ก่อนรันครั้งแรกเราเขียนกติกาไว้ล่วงหน้า (pre-register): ใช้ข้อมูล {windowLabel(row.inSample)} ทดลอง
          และกัน {windowLabel(row.outOfSample)} ไว้ตรวจรอบสุดท้าย ถ้าผลเข้าเกณฑ์นี้ให้ทิ้งสมมติฐาน: <b>{row.killCriteria}</b>
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">สถานะตอนนี้ <HypothesisStatusBadge value={row.status} /> <Link href="/board" className="text-primary hover:underline">ดูบน Research Board</Link></div>
      </Panel>

      <ol className="grid gap-2 sm:grid-cols-5" aria-label="ขั้นตอนของสมมติฐานนี้">
        {steps.map((step, index) => (
          <li key={step.label} className={cn('rounded-md border p-3', step.done ? 'border-positive/50' : 'border-border border-dashed')}>
            <p className="num text-sm text-muted-foreground">{index + 1}</p>
            <p className="text-base font-medium">{step.label}</p>
            <p className="text-sm text-muted-foreground">{step.detail}</p>
          </li>
        ))}
      </ol>

      <Panel title="ผลทดสอบทั้งหมดของสมมติฐานนี้" icon={Scale}>
        <ExperimentLedgerMini rows={experiments} />
        <p className="text-sm text-muted-foreground">ตัวเลขดึงจากไฟล์ experiment ที่สคริปต์เขียนทุกครั้งที่เปิดหน้า ยิ่งลองหลายแบบ ผลที่ดีที่สุดยิ่งต้องลดความเชื่อลง (เหตุผลที่เรานับ trial)</p>
      </Panel>

      {papers.length > 0 && (
        <Panel title="มาจากงานวิจัยไหน" icon={BookOpen}>
          <ul className="space-y-1.5">
            {papers.map((paper) => (
              <li key={paper.slug}><Link href={`/read/${paper.slug}`} className="text-primary hover:underline">{paper.title}</Link> <span className="num text-sm text-muted-foreground">{paper.group}</span></li>
            ))}
          </ul>
        </Panel>
      )}
      <h2 className="pt-2 text-2xl">บันทึกสมมติฐาน</h2>
    </div>
  );
}

function PaperContext({ document, articles, hypotheses }: { document: WikiDoc; articles: ArticleRow[]; hypotheses: HypothesisRow[] }) {
  const meta = document.meta;
  const authors = (meta.authors || '').replace(/^\[|\]$/g, '').split(',').map((name) => name.trim()).filter(Boolean);
  const fulltext = meta.verified_against === 'fulltext';
  const usedBy = hypotheses.filter((item) => item.sourcePapers.includes(document.slug));
  return (
    <div className="mb-6 space-y-4">
      <ArticleLinks articles={articles} />
      <Panel title="ข้อมูลงานวิจัย" icon={BookOpen}>
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <dt className="text-muted-foreground">ผู้เขียน</dt><dd>{authors.join(', ') || '—'}</dd>
          <dt className="text-muted-foreground">ตีพิมพ์</dt><dd><i>{meta.journal || '—'}</i> {meta.year} {meta.volume && `· vol. ${meta.volume}`}{meta.issue && `(${meta.issue})`} {meta.pages && `· pp. ${meta.pages}`}</dd>
          <dt className="text-muted-foreground">DOI</dt><dd>{meta.doi ? <a href={`https://doi.org/${meta.doi}`} target="_blank" rel="noreferrer" className="num text-primary hover:underline">{meta.doi}</a> : '—'}</dd>
          <dt className="text-muted-foreground">ตรวจกับ</dt>
          <dd className="flex flex-wrap items-center gap-2">
            <VerificationBadge value={document.verification} />
            {fulltext ? 'เทียบกับ full text แล้ว เลขหน้าในตารางอ้างอิงได้' : 'อ่านได้แค่ abstract ข้อมูลส่วนใหญ่ยังต้องรอตรวจกับต้นฉบับ'}
          </dd>
        </dl>
        <p className="text-sm text-muted-foreground">หน้านี้คือ <b>source note</b> สำหรับงานวิจัย เก็บเป็นตาราง claim สั้นๆ พร้อมเลขหน้า ถ้าอยากเข้าใจ paper ทั้งเรื่อง ให้อ่านบทความด้านบนก่อน</p>
        {usedBy.length > 0 && <p className="text-sm">ใช้เป็นหลักฐานของ {usedBy.map((item) => <Link key={item.slug} href={`/read/${item.slug}`} className="num mr-2 text-primary hover:underline">{item.id}</Link>)}</p>}
      </Panel>
      <h2 className="pt-2 text-2xl">Source note</h2>
    </div>
  );
}

function ArticleContext({ article, targets }: { article?: ArticleRow; targets: Pick<WikiDoc, 'slug' | 'title' | 'kind'>[] }) {
  if (!targets.length && !article) return null;
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-5 py-4 text-base">
      <span className="text-muted-foreground">บทความนี้อธิบาย</span>
      {targets.map((target) => (
        <Link key={target.slug} href={`/read/${target.slug}`} className="inline-flex items-center gap-2 rounded-md border border-border px-2.5 py-1 hover:border-primary/60">
          <KindBadge label={target.kind.toUpperCase()} kind={target.kind} className="h-5 text-xs" />{target.title}<ArrowRight className="size-3.5" aria-hidden />
        </Link>
      ))}
      {article?.basis && <span className="num ml-auto text-sm text-muted-foreground">{article.basis}</span>}
    </div>
  );
}

export type ContextData = {
  articles: ArticleRow[]; hypotheses: HypothesisRow[]; experiments: ExperimentRow[];
  docs: Pick<WikiDoc, 'slug' | 'title' | 'kind' | 'group'>[];
};

export function ContextPanel({ document, data }: { document: WikiDoc; data: ContextData }) {
  const aboutThis = data.articles.filter((article) => article.about.includes(document.slug));
  if (document.kind === 'experiment') {
    const row = data.experiments.find((item) => item.slug === document.slug);
    if (!row) return null;
    return <ExperimentContext row={row} hypothesis={data.hypotheses.find((item) => item.slug === row.hypothesisSlug)} />;
  }
  if (document.kind === 'hypothesis') {
    const row = data.hypotheses.find((item) => item.slug === document.slug);
    if (!row) return null;
    const experiments = data.experiments.filter((item) => item.hypothesisSlug === row.slug).sort((a, b) => (a.trialNo ?? 0) - (b.trialNo ?? 0));
    const papers = data.docs.filter((doc) => row.sourcePapers.includes(doc.slug));
    return <HypothesisContext row={row} experiments={experiments} papers={papers} articles={aboutThis} />;
  }
  if (document.kind === 'paper') return <PaperContext document={document} articles={aboutThis} hypotheses={data.hypotheses} />;
  if (document.kind === 'article') {
    const article = data.articles.find((item) => item.slug === document.slug);
    return <ArticleContext article={article} targets={data.docs.filter((doc) => article?.about.includes(doc.slug))} />;
  }
  return null;
}
