# Alpha Research Wiki

หน่วยความจำของกระบวนการวิจัย alpha: เก็บ paper, hypothesis, experiment และ factor เป็น Markdown ที่ย้อนตรวจได้
ว่าทุกข้อสรุปมาจากหลักฐานไหน และลองอะไรไปแล้วกี่ครั้ง

> Material ประกอบ Quant Bootcamp (QuantCU × QuantCorner) Module 11 — AI and LLM in the Research Process

## เริ่มใช้งาน

```bash
git clone https://github.com/Migchw/alpha-research-wiki.git
cd alpha-research-wiki
pip install -r requirements.txt
python scripts/wiki_lint.py
```

เปิดโฟลเดอร์นี้เป็น vault ใน [Obsidian](https://obsidian.md/download) แล้วดู `hypotheses.base` (Research Board / Graveyard)
และ `experiments.base` (Experiment Ledger)

ต้องใช้ Python 3.10+ · Node.js 22.13+ (dashboard) · Git · agent: Claude Code (แพลน Pro ขึ้นไป) หรือ [ทางเลือกฟรี](docs/free-alternatives.md)

## Checkpoint ระหว่างดูคลิป

ในคลิปผู้สอนสร้าง vault จากโฟลเดอร์ว่างทีละขั้น Claude ตอบไม่เหมือนกันทุกครั้ง ถ้าของคุณออกมาไม่ตรงกับในคลิป
ให้ clone repo นี้แล้วกระโดดไปที่จุดเดียวกับผู้สอน (ปุ่ม "Use this template" ไม่คัดลอก tag มาด้วย ต้องใช้ `git clone`)

```bash
git clone https://github.com/Migchw/alpha-research-wiki.git
cd alpha-research-wiki
git checkout step-2-papers        # เปลี่ยนเป็น checkpoint ที่ต้องการ
```

| Checkpoint | ตอน | มีอะไรแล้ว |
|---|---|---|
| `step-1-scaffold` | EP2 | AGENTS.md / CLAUDE.md, templates, `wiki_lint.py`, โฟลเดอร์ว่าง |
| `step-2-papers` | EP3 | `/find-paper`, `/ingest-paper` และ paper 5 ชิ้นพร้อมบทความ |
| `step-3-backtest` | EP4 | H-001 (pre-registered), `backtest_momentum.py` + test, notebook, E-001..E-003 รอ Reviewer |
| `step-4-reviewer` | EP5 | Reviewer subagent, `/log-experiment`, `/wiki-lint`, lint hook |
| `step-5-dashboard` | EP8 | ทุกอย่างใน `master` รวม dashboard และ pipeline ของ EP7 |

checkpoint 1–4 อยู่บน branch `build-steps` เป็นไฟล์ชุดเดียวกับ `master` ที่เรียงตามลำดับในคลิป
กลับมาตัวเต็มด้วย `git checkout master`

## Skills และ Reviewer

เปิด `claude` (หรือ `agy`) ที่ root ของ repo แล้วพิมพ์คำสั่ง · ขั้นตอนเต็มอยู่ใน `.claude/skills/<ชื่อ>/SKILL.md`

| คำสั่ง | ทำอะไร |
|---|---|
| `/find-paper <ชื่อ หรือ DOI>` | ตรวจว่า paper มีจริงกับ Crossref/OpenAlex หาฉบับที่อ่านฟรีได้ แล้วบันทึกใน `reading-list.md` |
| `/ingest-paper <citekey>` | อ่านต้นฉบับใน `raw/pdf/` แล้วเขียน source note (claim + เลขหน้า) และบทความอธิบาย |
| `/log-experiment <H-xxx> <12-1\|12-7> [sample]` | รัน backtest เป็น trial ใหม่ → Reviewer → ตัดสินตาม kill criteria (ถามก่อนเปลี่ยน status) |
| `/wiki-lint` | ตรวจ vault ด้วย `scripts/wiki_lint.py` |
| Reviewer | Claude Code: subagent `.claude/agents/reviewer.md` · agent อื่น: `/reviewer experiments/E-xxx.md` |

- Claude Code มี hook รัน lint ทุกครั้งที่เขียนไฟล์ (`.claude/settings.json`) agent อื่นให้รัน lint เองก่อน commit
- `.agents/skills/` คือสำเนาสำหรับ Antigravity CLI และ agent อื่น สร้างด้วย `python scripts/sync_skills.py` ห้ามแก้ตรงๆ

## Dashboard (EP8)

```bash
cd dashboard
npm install
npm run dev        # http://localhost:3000 · แก้โน้ตแล้วรัน npm run index ใหม่
```

Research Board · Experiment Ledger · Graph · บทความ อ่านอย่างเดียว ไม่แก้ไฟล์ใน vault รายละเอียดใน [`dashboard/README.md`](dashboard/README.md)

## เริ่ม Hands-on project ของตัวเอง

กด **Use this template** แล้วทำตาม [docs/your-project.md](docs/your-project.md) (มีการบ้าน EP8: ingest 1 paper + register 1 hypothesis)

## Research loop

```
paper → hypothesis (pre-register) → experiment (1 รัน = 1 trial) → Reviewer gate → factor | graveyard
```

ตัวอย่างที่ใช้เดินเรื่อง: [H-001 Intermediate momentum ใน SET100](hypotheses/H-001-intermediate-momentum-set.md)

## Backtest (EP4)

```bash
python scripts/test_backtest_momentum.py                                 # ตรวจ signal window ด้วยข้อมูลสังเคราะห์
python scripts/backtest_momentum.py --hypothesis H-001 --lookback 12-1 --dry-run   # ดูผล ไม่นับเป็น trial
python scripts/backtest_momentum.py --hypothesis H-001 --lookback 12-7   # รันจริง → experiments/E-xxx.md
```

- quintile long-short, rebalance รายเดือน, ค่าธรรมเนียม 30 bps ราคาจาก yfinance (cache ใน `data/` ไม่ commit)
- ทุกการรันจริงเขียน experiment ใหม่ `trial_no` +1 และ `code_ref` มี git SHA
- ปฏิเสธการรันถ้า hypothesis ยังไม่ `preregistered`/`testing` และล็อก `--sample out_of_sample`
  จนกว่า in-sample จะผ่าน Reviewer
- รายชื่อหุ้นอยู่ที่ `scripts/set100.txt` (รายชื่อปัจจุบัน → survivorship bias โดยตั้งใจ)
- รันบน Colab: [เปิดใน Colab](https://colab.research.google.com/github/Migchw/alpha-research-wiki/blob/master/notebooks/backtest_momentum.ipynb)
  ([`notebooks/backtest_momentum.ipynb`](notebooks/backtest_momentum.ipynb))

## เอกสาร → facts (EP7)

```bash
python scripts/extract_pdf.py --name ap-2026-q2 --url https://ap.listedcompany.com/misc/MDNA/20260813-ap-mdna-2q2026-en.pdf --sha256 bac2ddd555a8a19351c4cabe0702c2f205fe355cf1bc1f11685be00d0b749f7a
python scripts/validate_facts.py --facts facts/runs/ap-2026-q2-opus-1.json --source data/filings/ap-2026-q2      # PASS
python scripts/validate_facts.py --facts facts/runs/ap-2026-q2-MUTATED-demo.json --source data/filings/ap-2026-q2 # FAIL 5 ข้อ
python scripts/test_validate_facts.py
```

- MarkItDown แปลงทีละหน้า (`## Page N`) · PDF และข้อความเต็มอยู่ใน `data/` ไม่ commit
- LLM สกัดตาม `scripts/extract_facts_prompt.md` (อ่านและชี้หน้า ไม่คำนวณ) · candidate ทุกรอบอยู่ใน `facts/runs/`
- validator ตรวจ schema · ค่าต้องพิมพ์อยู่ในหน้าที่อ้าง · ยอดรวมลงตัวภายในการปัดเศษของเอกสาร · ผ่านแล้วจึงเขียน `facts/<name>.json`

## ใช้กับ agent ตัวไหนก็ได้

กติกาอยู่ใน [`AGENTS.md`](AGENTS.md) ใช้ได้กับ Claude Code, Antigravity CLI (`agy`) และ agent อื่นที่อ่าน AGENTS.md
vault เป็น Markdown + YAML ธรรมดา ไม่ผูกกับเครื่องมือใด และ lint / backtest / dashboard ใช้ได้โดยไม่ต้องมี LLM

- ไม่มี Claude แบบเสียเงิน: [docs/free-alternatives.md](docs/free-alternatives.md) (Gemini CLI แบบฟรีปิดไปแล้วตั้งแต่ 18 มิ.ย. 2026)

## ข้อควรรู้

- ห้าม commit PDF หรือ full-text ของ paper และไฟล์ราคา (มีใน `.gitignore` แล้ว)
- เนื้อหาเพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน

- License: [MIT](LICENSE)
