# ใช้ vault นี้โดยไม่มี Claude แบบเสียเงิน

Claude Code ต้องใช้แพลน Pro ขึ้นไป (แพลนฟรีของ claude.ai ใช้ Claude Code ไม่ได้) แต่ vault นี้ไม่ได้ผูกกับ Claude:
โน้ตทั้งหมดเป็น Markdown + YAML ธรรมดา และกติกาอยู่ใน [`AGENTS.md`](../AGENTS.md) ไฟล์เดียว เลือกได้ 3 ระดับ

| ระดับ | ใช้อะไร | ทำอะไรได้ | ค่าใช้จ่าย |
|---|---|---|---|
| 0 · ไม่ใช้ LLM | Python + Obsidian + dashboard | lint · backtest · validate facts · Research Board · Ledger | ฟรี |
| 1 · แชทธรรมดา | Gemini / ChatGPT / Claude บนเว็บ แพลนฟรี | ช่วยร่าง source note และ hypothesis แล้วเราวางไฟล์เอง | ฟรี (มีโควตา) |
| 2 · agent ใน terminal | Antigravity CLI (`agy`) หรือ agent อื่นที่อ่าน `AGENTS.md` | อ่านและเขียนไฟล์ใน vault เอง ทำตาม skill ได้ | free tier มีโควตาจำกัด |

> **Gemini CLI แบบฟรีปิดแล้ว** ตั้งแต่ 18 มิ.ย. 2026 Google หยุดให้บริการ Gemini CLI สำหรับบัญชีฟรี (Gemini Code Assist
> for individuals) และ Google AI Pro/Ultra ให้ย้ายไปใช้ Antigravity CLI แทน
> ([ประกาศของ Google](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/))
> เราลองรัน `gemini -p` (v0.63) ด้วย Google login เมื่อ 2026-10-25 แล้วได้ `IneligibleTierError: This client is no longer supported`

## ระดับ 0: research loop โดยไม่ใช้ LLM

แก่นของระบบคือสคริปต์และ schema ซึ่งไม่ต้องใช้ AI เลย

```bash
python scripts/wiki_lint.py                                           # ตรวจ vault (แทน hook)
python scripts/backtest_momentum.py --hypothesis H-001 --lookback 12-7 --dry-run
python scripts/validate_facts.py --facts <ไฟล์>.json --source data/filings/<name>
cd dashboard && npm install && npm run dev                            # http://localhost:3000
```

- เขียนโน้ตเองจาก `templates/` ใน Obsidian (Settings → Core plugins → Templates → ตั้งโฟลเดอร์เป็น `templates`)
- `hypotheses.base` และ `experiments.base` ใช้เป็น Research Board และ Experiment Ledger ใน Obsidian ได้เลย
- รัน `python scripts/wiki_lint.py` ทุกครั้งก่อน commit เพราะเครื่องมืออื่นไม่มี hook ของ Claude Code

## ระดับ 1: ใช้แชทแพลนฟรีช่วยร่าง

แชทบนเว็บอ่านไฟล์ใน vault ไม่ได้ เราจึงต้องส่งกติกาและต้นฉบับให้เอง แล้ววางผลลงไฟล์เอง

1. เปิดแชทใหม่ วาง `AGENTS.md` ทั้งไฟล์ ตามด้วย skill ที่ต้องการ เช่น `.claude/skills/ingest-paper/SKILL.md`
   และ template ที่เกี่ยวข้อง (`templates/Paper.md`)
2. ส่งข้อความของ paper **ทีละหน้าพร้อมเลขหน้า** (แปลงด้วยคำสั่ง PyMuPDF ใน skill ข้อ 0) อย่าส่งแค่ชื่อ paper
   เพราะโมเดลจะเขียนจากความจำ ซึ่งผิดได้ทั้งตัวเลขและ DOI (ดู EP6)
3. คัดผลลงไฟล์ใน `papers/` แล้ว **เปิดต้นฉบับตรวจทุก claim กับเลขหน้าที่อ้าง**
4. รัน `python scripts/wiki_lint.py` ให้ผ่าน

ข้อจำกัด: โมเดลไม่เห็น vault ทั้งหมด จึงลิงก์ concept หรือนับ trial ให้ไม่ได้ ห้ามให้แชทเขียนตัวเลขผล backtest
(กติกาข้อ 2) ให้วางเฉพาะตัวเลขที่สคริปต์พิมพ์ออกมา

## ระดับ 2: Antigravity CLI (`agy`)

Antigravity CLI อ่าน `AGENTS.md` ที่ root ของ repo เองโดยไม่ต้องตั้งค่า เราทดสอบเมื่อ 2026-10-25 (agy 1.4.7):
ถามว่า "ห้ามลบ hypothesis ที่ล้มเหลวใช่ไหม" โดยไม่เอ่ยชื่อไฟล์ ได้คำตอบตามกติกาข้อ 5 ในรอบเดียว
และ log (`--output-format stream-json`) ไม่มีการเรียก tool อ่านไฟล์เลย

```bash
cd alpha-research-wiki
agy                       # เปิด session แบบ interactive
agy -p "สรุปกติกาทองใน AGENTS.md เป็น 3 บรรทัด"     # รันครั้งเดียว
```

ติดตั้งตามหน้าทางการที่ [antigravity.google](https://antigravity.google) แล้วเปิด terminal ใหม่ ตรวจด้วย `agy --version`

**Skills:** agy ไม่เห็น skill ใน `.claude/skills/` (ทดสอบแล้ว) ให้สั่งด้วย path ของไฟล์ตรงๆ แทน

| Claude Code | สั่ง agy |
|---|---|
| `/find-paper novy-marx-2012` | `อ่าน .claude/skills/find-paper/SKILL.md แล้วทำตามกับ novy-marx-2012` |
| `/ingest-paper <citekey>` | `อ่าน .claude/skills/ingest-paper/SKILL.md แล้วทำตามกับ <citekey> ต้นฉบับอยู่ที่ raw/pdf/<ไฟล์>.pdf` |
| `/log-experiment H-001 12-7` | `อ่าน .claude/skills/log-experiment/SKILL.md แล้วทำตามกับ H-001 12-7 in_sample` (ข้อ 3 ให้หยุดรอ Reviewer ด้านล่าง) |
| `/wiki-lint` | รัน `python scripts/wiki_lint.py` เอง |

**Reviewer:** เปิด session ใหม่แยกจาก session ที่รัน backtest (ให้ Reviewer ไม่เห็นบทสนทนาที่อยากให้ผลผ่าน) แล้วสั่ง
`อ่าน .claude/agents/reviewer.md แล้วตรวจ experiments/E-xxx.md ตาม checklist ทุกข้อ`

**Hook:** ไม่มี hook ให้ รัน `python scripts/wiki_lint.py` เองหลัง agent เขียนไฟล์ และก่อน commit ทุกครั้ง

**โควตา:** free tier ของ Antigravity มีโควตาน้อยกว่า Gemini CLI เดิมมาก และ Google ไม่ได้ประกาศตัวเลขชัดเจน
(ตรวจที่หน้า plans ของบัญชีตัวเอง) งานยาวอย่าง ingest paper ทั้งชิ้นอาจใช้โควตาหมดในครั้งเดียว ถ้าหมดให้ทำต่อแบบระดับ 1

## agent อื่น

agent ที่อ่าน `AGENTS.md` (เช่น Codex CLI ซึ่งต้องใช้บัญชี ChatGPT) ใช้วิธีเดียวกับระดับ 2 ได้ แต่เรายังไม่ได้ทดสอบกับ repo นี้
ถ้า agent ของคุณอ่านแค่ไฟล์ชื่ออื่น ให้สร้างไฟล์นั้นแล้วเขียนบรรทัดเดียวว่า "อ่าน AGENTS.md ก่อนทำงานทุกครั้ง"

## สิ่งที่ต้องทำเองเมื่อไม่ใช้ Claude Code

| Claude Code ทำให้ | ทำเองแทน |
|---|---|
| hook รัน lint หลังเขียนไฟล์ | `python scripts/wiki_lint.py` ก่อน commit |
| subagent Reviewer แยก context | session ใหม่ + `.claude/agents/reviewer.md` |
| `/skill` | สั่งด้วย path ของ `SKILL.md` |
| `CLAUDE.md` ดึง `AGENTS.md` | agy อ่าน `AGENTS.md` เอง |

> เนื้อหาเพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน
