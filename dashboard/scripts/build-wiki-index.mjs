import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import GithubSlugger from 'github-slugger';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vaultRoot = path.resolve(process.env.WIKI_VAULT_PATH || path.join(projectRoot, '..'));

function frontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!item) continue;
    result[item[1]] = item[2].replace(/^['"]|['"]$/g, '').trim();
  }
  return result;
}

function tagList(value = '') {
  return value.replace(/^\[|\]$/g, '').split(',').map((tag) => tag.replace(/^['"]|['"]$/g, '').trim()).filter(Boolean);
}

function withoutFrontmatter(markdown) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();
}

function cleanText(value) {
  return value
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1')
    // List markers only at line start; keep "-" and "_" inside words (H-001, 12-1, backtest_momentum.py).
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, ' ')
    .replace(/[*`>#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function section(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`^#{1,3} ${escaped}\\s*\\r?\\n([\\s\\S]*?)(?=^#{1,3} |(?![\\s\\S]))`, 'mi'));
  return match ? cleanText(match[1].split(/\r?\n\r?\n/)[0]) : '';
}

// Fallback summary: the first plain paragraph after the frontmatter (skips headings, tables, lists).
function firstParagraph(markdown) {
  const body = withoutFrontmatter(markdown).split(/\r?\n\r?\n/);
  const paragraph = body.find((block) => block.trim() && !/^(#|\||>|[-*] |\d+\. |---)/.test(block.trim()));
  return paragraph ? cleanText(paragraph) : '';
}

function firstHeading(markdown) {
  const match = withoutFrontmatter(markdown).match(/^#\s+(.+)$/m);
  // Keep "-" and "_" (ids like H-001, sample names like in_sample); drop only links and emphasis marks.
  return match ? match[1].replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1').replace(/[*`]/g, '').trim() : '';
}

function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100) || 'note';
}

// First [[target]] in a frontmatter value, e.g. hypothesis: "[[H-001-intermediate-momentum-set]]".
function linkTarget(value = '') {
  const match = value.match(/\[\[([^\]|#]+)/);
  return match ? match[1].trim() : '';
}

function numberOrNull(value) {
  if (value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

// Verification state shown in badges and the graph: papers by what they were checked against,
// experiments by the Reviewer verdict.
function verificationOf(kind, meta) {
  if (kind === 'paper') return ['fulltext', 'working_paper'].includes(meta.verified_against) ? 'verified' : 'pending';
  if (kind === 'experiment') return meta.reviewer_verdict || 'pending';
  return '';
}

async function markdownFiles(relativeDir, kind) {
  const absoluteDir = path.join(vaultRoot, relativeDir);
  const names = (await readdir(absoluteDir).catch(() => [])).filter((name) => name.endsWith('.md') && name !== 'README.md');
  return Promise.all(names.map(async (name) => {
    const markdown = await readFile(path.join(absoluteDir, name), 'utf8');
    const meta = frontmatter(markdown);
    const fileName = path.basename(name, '.md');
    return {
      kind,
      name: fileName,
      slug: `${kind}-${slugify(fileName)}`,
      title: meta.title || firstHeading(markdown) || fileName,
      date: meta.updated || meta.created || (meta.run_at || '').slice(0, 10) || meta.year || '',
      status: meta.status || meta.reviewer_verdict || '',
      verification: verificationOf(kind, meta),
      confidence: '',
      tags: tagList(meta.tags),
      group: meta.id || meta.citekey || '',
      brief: section(markdown, 'สรุปสั้นก่อนอ่าน') || section(markdown, 'สรุป 3 บรรทัด') || section(markdown, 'นิยาม') || section(markdown, 'ทำไมถึงคิดว่าน่าจะใช้ได้ (กลไก)') || firstParagraph(markdown),
      meta,
      markdown,
      path: `${relativeDir}/${name}`.replaceAll('\\', '/'),
    };
  }));
}

async function singleDocument(relativePath, slug, title) {
  const markdown = await readFile(path.join(vaultRoot, relativePath), 'utf8').catch(() => `# ${title}\n\nไม่พบไฟล์ ${relativePath}`);
  const meta = frontmatter(markdown);
  return { kind: 'schema', name: path.basename(relativePath, '.md'), slug, title, date: meta.updated || '', status: meta.status || 'active', verification: '', confidence: '', tags: [], group: '', brief: '', meta, markdown, path: relativePath };
}

const [articles, papers, concepts, hypotheses, experiments, factors, agents, readme, readingList] = await Promise.all([
  markdownFiles('articles', 'article'),
  markdownFiles('papers', 'paper'),
  markdownFiles('concepts', 'concept'),
  markdownFiles('hypotheses', 'hypothesis'),
  markdownFiles('experiments', 'experiment'),
  markdownFiles('factors', 'factor'),
  singleDocument('AGENTS.md', 'schema-agents', 'กติกาของ vault (AGENTS.md)'),
  singleDocument('README.md', 'schema-readme', 'README'),
  singleDocument('reading-list.md', 'reading-list', 'Reading list'),
]);

const notes = [...articles, ...hypotheses, ...experiments, ...factors, ...papers, ...concepts];
const allDocuments = [...notes, agents, readme, readingList];
const documentLookup = new Map();
for (const document of allDocuments) {
  documentLookup.set(document.name.toLowerCase(), document);
  documentLookup.set(document.path.replace(/\.md$/i, '').toLowerCase(), document);
}

function readerMarkdown(markdown) {
  return withoutFrontmatter(markdown)
    .replace(/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, (_, target) => {
      const normalized = target.replaceAll('\\', '/').replace(/^assets\//, '');
      return `![${path.basename(normalized)}](/vault-assets/${normalized.split('/').map(encodeURIComponent).join('/')})`;
    })
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
      const normalized = target.replace(/\.md$/i, '').replaceAll('\\', '/').trim();
      const document = documentLookup.get(normalized.toLowerCase()) || documentLookup.get(path.basename(normalized).toLowerCase());
      const text = (label || path.basename(normalized)).trim();
      return document ? `[${text}](/read/${document.slug})` : `\`${text}\``;
    });
}

// The reader already shows the title above the card, so drop a leading "# Title" that repeats it.
function withoutTitleHeading(document) {
  const body = withoutFrontmatter(document.markdown);
  return firstHeading(document.markdown) === document.title ? body.replace(/^#\s+.+\r?\n?/, '') : document.markdown;
}

// Notes a document links to through a real wikilink, by title (the "related" column in the library).
function linkedTitles(document) {
  if (document.kind === 'schema') return [];
  const titles = [];
  for (const match of document.markdown.matchAll(/(?<!!)\[\[([^\]|#]+)/g)) {
    const target = documentLookup.get(match[1].trim().toLowerCase());
    if (target && target !== document && target.kind !== 'schema' && !titles.includes(target.group || target.title)) {
      titles.push(target.group || target.title);
    }
  }
  return titles;
}

const documents = allDocuments.map((document) => ({
  slug: document.slug,
  kind: document.kind,
  title: document.title,
  date: document.date,
  status: document.status,
  verification: document.verification,
  confidence: document.confidence,
  tags: document.tags,
  group: document.group,
  related: linkedTitles(document),
  brief: (document.brief || '').slice(0, 520),
  path: document.path,
  // Flat frontmatter (strings) for the reader's context panels; schema docs don't need it.
  meta: document.kind === 'schema' ? {} : document.meta,
  markdown: readerMarkdown(withoutTitleHeading(document)),
}));

// Research Board and Experiment Ledger read these flat records (frontmatter is flat by schema).
const slugOf = (name) => documentLookup.get(name.toLowerCase())?.slug || '';
const research = {
  // Articles point at the notes they explain through `about: [[...]]`.
  articles: articles.map((doc) => ({
    slug: doc.slug, title: doc.title, brief: (doc.brief || '').slice(0, 320), status: doc.meta.status || 'draft',
    readMin: numberOrNull(doc.meta.read_min), basis: doc.meta.basis || '', created: doc.meta.created || '',
    about: [...(doc.meta.about || '').matchAll(/\[\[([^\]|#]+)/g)].map((m) => slugOf(m[1].trim())).filter(Boolean),
  })),
  hypotheses: hypotheses.map((doc) => ({
    slug: doc.slug,
    id: doc.meta.id || doc.name,
    title: doc.title,
    status: doc.meta.status || 'idea',
    signal: doc.meta.signal || '',
    universe: doc.meta.universe || '',
    killCriteria: doc.meta.kill_criteria || '',
    inSample: doc.meta.in_sample || '',
    outOfSample: doc.meta.out_of_sample || '',
    sourcePapers: [...(doc.meta.source_papers || '').matchAll(/\[\[([^\]|#]+)/g)].map((m) => slugOf(m[1].trim())).filter(Boolean),
    rejectedReason: doc.meta.rejected_reason || '',
    created: doc.meta.created || '',
    experiments: experiments.filter((exp) => linkTarget(exp.meta.hypothesis) === doc.name).length,
  })),
  experiments: experiments.map((doc) => {
    const hypothesis = linkTarget(doc.meta.hypothesis);
    return {
      slug: doc.slug,
      id: doc.meta.id || doc.name,
      hypothesisSlug: slugOf(hypothesis),
      hypothesisId: hypotheses.find((item) => item.name === hypothesis)?.meta.id || hypothesis,
      trialNo: numberOrNull(doc.meta.trial_no),
      lookback: doc.meta.lookback || '',
      sample: doc.meta.sample || '',
      sharpe: numberOrNull(doc.meta.sharpe),
      annReturn: numberOrNull(doc.meta.ann_return),
      tStat: numberOrNull(doc.meta.t_stat),
      maxDd: numberOrNull(doc.meta.max_dd),
      turnover: numberOrNull(doc.meta.turnover),
      verdict: doc.meta.reviewer_verdict || 'pending',
      knownBiases: tagList(doc.meta.known_biases),
      costsBps: numberOrNull(doc.meta.costs_bps),
      quantiles: numberOrNull(doc.meta.quantiles),
      codeRef: doc.meta.code_ref || '',
      runAt: doc.meta.run_at || '',
    };
  }),
};

// Vault-wide link graph, built only from real [[wikilinks]] (frontmatter included), like Obsidian's graph view.
const graphDocuments = allDocuments.filter((document) => document.kind !== 'schema');
const edgeKeys = new Set();
const graphLinks = [];
for (const document of graphDocuments) {
  for (const match of document.markdown.matchAll(/(?<!!)\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)) {
    const normalized = match[1].replace(/\.md$/i, '').replaceAll('\\', '/').trim().toLowerCase();
    const target = documentLookup.get(normalized) || documentLookup.get(path.basename(normalized));
    if (!target || target === document || target.kind === 'schema') continue;
    const key = [document.slug, target.slug].sort().join('|');
    if (edgeKeys.has(key)) continue;
    edgeKeys.add(key);
    graphLinks.push({ source: document.slug, target: target.slug });
  }
}
const graph = {
  nodes: graphDocuments.map((document) => ({ id: document.slug, label: document.group || document.title, kind: document.kind, pending: document.verification === 'pending' })),
  links: graphLinks,
};

// Full-text search chunks: one chunk per heading section, anchored to the heading id rehype-slug generates.
function headingText(value) {
  return value
    .replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .trim();
}
const searchChunks = [];
for (const document of allDocuments) {
  const slugger = new GithubSlugger();
  let heading = '';
  let anchor = '';
  let buffer = [];
  const flush = () => {
    const text = cleanText(buffer.join('\n').replace(/\|/g, ' ')).slice(0, 1500);
    if (text) searchChunks.push({ slug: document.slug, kind: document.kind, title: document.title, heading, anchor, text });
    buffer = [];
  };
  for (const line of withoutFrontmatter(document.markdown).split(/\r?\n/)) {
    const match = line.match(/^(#{1,4})\s+(.*)$/);
    if (match) {
      flush();
      heading = headingText(match[2]);
      anchor = slugger.slug(heading);
    } else {
      buffer.push(line);
    }
  }
  flush();
}

const count = (kind) => notes.filter((document) => document.kind === kind).length;
const index = {
  generatedAt: new Date().toISOString(),
  vaultName: path.basename(vaultRoot),
  stats: {
    articles: count('article'),
    papers: count('paper'),
    concepts: count('concept'),
    hypotheses: count('hypothesis'),
    experiments: count('experiment'),
    factors: count('factor'),
    pendingReview: experiments.filter((document) => document.verification === 'pending').length,
  },
  research,
  documents,
  graph,
};

await mkdir(path.join(projectRoot, 'data'), { recursive: true });
const assets = path.join(vaultRoot, 'assets');
if (await stat(assets).catch(() => null)) {
  await mkdir(path.join(projectRoot, 'public', 'vault-assets'), { recursive: true });
  await cp(assets, path.join(projectRoot, 'public', 'vault-assets'), { recursive: true, force: true });
}
await writeFile(path.join(projectRoot, 'data', 'wiki-index.json'), `${JSON.stringify(index, null, 2)}\n`, 'utf8');
await writeFile(path.join(projectRoot, 'data', 'search-index.json'), `${JSON.stringify({ chunks: searchChunks })}\n`, 'utf8');
console.log(`Indexed ${papers.length} papers, ${hypotheses.length} hypotheses, ${experiments.length} experiments and ${documents.length} readable documents from ${vaultRoot}`);
