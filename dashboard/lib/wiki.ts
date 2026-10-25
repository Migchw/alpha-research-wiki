export type DocKind = 'paper' | 'concept' | 'hypothesis' | 'experiment' | 'factor' | 'schema';

export type WikiDoc = {
  slug: string; kind: DocKind; title: string; date: string; status: string;
  verification: string; confidence: string; tags: string[]; group: string; related: string[]; brief: string; path: string; markdown: string;
};
export type DocSummary = Omit<WikiDoc, 'markdown'>;
export type NavDoc = Pick<WikiDoc, 'slug' | 'title' | 'kind'>;

export type HypothesisStatus = 'idea' | 'preregistered' | 'testing' | 'promoted' | 'rejected';
export type HypothesisRow = {
  slug: string; id: string; title: string; status: HypothesisStatus | string; signal: string; universe: string;
  killCriteria: string; rejectedReason: string; created: string; experiments: number;
};
export type ExperimentRow = {
  slug: string; id: string; hypothesisSlug: string; hypothesisId: string; trialNo: number | null;
  lookback: string; sample: string; sharpe: number | null; annReturn: number | null; tStat: number | null;
  maxDd: number | null; turnover: number | null; verdict: string; knownBiases: string[]; runAt: string;
};

export type WikiIndex = {
  generatedAt: string; vaultName: string;
  stats: { papers: number; concepts: number; hypotheses: number; experiments: number; factors: number; pendingReview: number };
  research: { hypotheses: HypothesisRow[]; experiments: ExperimentRow[] };
  documents: WikiDoc[];
  graph: import('@/components/knowledge-graph').WikiGraph;
};

export const kindLabel: Record<string, string> = {
  paper: 'PAPER', concept: 'CONCEPT', hypothesis: 'HYPOTHESIS', experiment: 'EXPERIMENT', factor: 'FACTOR', schema: 'SYSTEM',
};

export function dateLabel(date: string) {
  if (!date) return 'ไม่ระบุวันที่';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('th-TH-u-ca-gregory', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed);
}
