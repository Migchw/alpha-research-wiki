import Overview from '@/components/overview';
import { wiki } from '@/lib/wiki-data';

export default function Home() {
  return (
    <Overview
      vaultName={wiki.vaultName}
      generatedAt={wiki.generatedAt}
      stats={wiki.stats}
      hypotheses={wiki.research.hypotheses}
      experiments={wiki.research.experiments}
      graph={wiki.graph}
    />
  );
}
