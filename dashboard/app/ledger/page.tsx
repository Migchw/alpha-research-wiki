import type { Metadata } from 'next';
import ExperimentLedger from '@/components/experiment-ledger';
import { wiki } from '@/lib/wiki-data';

export const metadata: Metadata = {
  title: 'Experiment Ledger · Alpha Research Desk',
  description: 'ทุก experiment ของทุก hypothesis เรียงตาม Sharpe, t-stat และ trial',
};

export default function LedgerPage() {
  return <ExperimentLedger experiments={wiki.research.experiments} />;
}
