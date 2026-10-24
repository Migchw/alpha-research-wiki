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

## Research loop

```
paper → hypothesis (pre-register) → experiment (1 รัน = 1 trial) → Reviewer gate → factor | graveyard
```

ตัวอย่างที่ใช้เดินเรื่อง: [H-001 Intermediate momentum ใน SET100](hypotheses/H-001-intermediate-momentum-set.md)

## ใช้กับ agent ตัวไหนก็ได้

กติกาอยู่ใน [`AGENTS.md`](AGENTS.md) ใช้ได้กับ Claude Code, Gemini CLI, Codex และอื่นๆ
vault เป็น Markdown + YAML ธรรมดา ไม่ผูกกับเครื่องมือใด

## ข้อควรรู้

- ห้าม commit PDF หรือ full-text ของ paper และไฟล์ราคา (มีใน `.gitignore` แล้ว)
- เนื้อหาเพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน
