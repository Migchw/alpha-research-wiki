export type DocKind = 'article' | 'paper' | 'concept' | 'hypothesis' | 'experiment' | 'factor' | 'schema';

export type WikiDoc = {
  slug: string; kind: DocKind; title: string; date: string; status: string;
  verification: string; confidence: string; tags: string[]; group: string; related: string[]; brief: string; path: string;
  meta: Record<string, string>; markdown: string;
};
export type DocSummary = Omit<WikiDoc, 'markdown'>;
export type NavDoc = Pick<WikiDoc, 'slug' | 'title' | 'kind'>;

export type HypothesisStatus = 'idea' | 'preregistered' | 'testing' | 'promoted' | 'rejected';
export type HypothesisRow = {
  slug: string; id: string; title: string; status: HypothesisStatus | string; signal: string; universe: string;
  killCriteria: string; inSample: string; outOfSample: string; sourcePapers: string[];
  rejectedReason: string; created: string; experiments: number;
};
export type ArticleRow = {
  slug: string; title: string; brief: string; status: string; readMin: number | null; basis: string; created: string; about: string[];
};
export type ExperimentRow = {
  slug: string; id: string; hypothesisSlug: string; hypothesisId: string; trialNo: number | null;
  lookback: string; sample: string; sharpe: number | null; annReturn: number | null; tStat: number | null;
  maxDd: number | null; turnover: number | null; verdict: string; knownBiases: string[]; runAt: string;
  costsBps: number | null; quantiles: number | null; codeRef: string;
};

export type FeedItem = {
  title: string; authors: string[]; released: string; featured: string; venue: string; identifier: string;
  source_url: string; summary: string; mlquant_url: string; inVault: boolean;
};
export type PaperFeed = { fetchedAt: string; topic: string; credit: string; items: FeedItem[] };

export type WikiIndex = {
  generatedAt: string; vaultName: string;
  stats: { articles: number; papers: number; concepts: number; hypotheses: number; experiments: number; factors: number; pendingReview: number };
  research: { articles: ArticleRow[]; hypotheses: HypothesisRow[]; experiments: ExperimentRow[] };
  documents: WikiDoc[];
  graph: import('@/components/knowledge-graph').WikiGraph;
  paperFeed: PaperFeed | null;
};

export const kindLabel: Record<string, string> = {
  article: 'ARTICLE', paper: 'PAPER', concept: 'CONCEPT', hypothesis: 'HYPOTHESIS', experiment: 'EXPERIMENT', factor: 'FACTOR', schema: 'SYSTEM',
};

export function dateLabel(date: string) {
  if (!date) return 'ไม่ระบุวันที่';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('th-TH-u-ca-gregory', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed);
}
