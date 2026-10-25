// Server-only: imports the full generated index (includes every note's Markdown).
import wikiIndex from '@/data/wiki-index.json';
import type { DocSummary, NavDoc, WikiIndex } from '@/lib/wiki';

export const wiki = wikiIndex as unknown as WikiIndex;

export function navDocs(): NavDoc[] {
  return wiki.documents.map(({ slug, title, kind }) => ({ slug, title, kind }));
}

export function docSummaries(): DocSummary[] {
  return wiki.documents.map(({ markdown, ...summary }) => { void markdown; return summary; });
}
