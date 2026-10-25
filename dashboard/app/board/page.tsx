import type { Metadata } from 'next';
import ResearchBoard from '@/components/research-board';
import { wiki } from '@/lib/wiki-data';

export const metadata: Metadata = {
  title: 'Research Board · Alpha Research Desk',
  description: 'Hypothesis แยกตามสถานะ รวม Graveyard',
};

export default function BoardPage() {
  return <ResearchBoard hypotheses={wiki.research.hypotheses} />;
}
