import type { Metadata } from 'next';
import Library from '@/components/library';
import { docSummaries } from '@/lib/wiki-data';

export const metadata: Metadata = {
  title: 'คลังความรู้ · Alpha Research Desk',
  description: 'รายการ Hypothesis, Experiment, Paper, Concept และ Factor ทั้งหมดในวอลต์',
};

export default function LibraryPage() {
  return <Library docs={docSummaries()} />;
}
