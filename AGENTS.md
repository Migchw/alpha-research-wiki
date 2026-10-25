# AGENTS.md — กติกาของ Alpha Research Wiki

ไฟล์นี้ใช้ร่วมกันทุก agent (Claude Code, Gemini CLI, Codex ฯลฯ) อ่านให้จบก่อนแก้ไฟล์ใดๆ

## ภารกิจ
vault นี้คือ **หน่วยความจำของกระบวนการวิจัย alpha**: เก็บ paper, hypothesis, experiment และ factor ให้ย้อนตรวจได้ว่า
ทุกข้อสรุปมาจากหลักฐานไหน และลองอะไรไปแล้วกี่ครั้ง

## กติกาทอง
1. **`raw/` ห้ามแก้** และห้ามเก็บ full-text หรือ PDF ของ paper ที่มีลิขสิทธิ์ใน git (เก็บ metadata, DOI และโน้ตของเราเอง)
2. **LLM ไม่ใช่เครื่องคิดเลข**: ตัวเลขผล backtest ต้องมาจากสคริปต์ใน `scripts/` เท่านั้น ห้ามเขียนตัวเลขเองหรือประมาณ
3. **Pre-register ก่อนทดสอบ**: hypothesis ต้องมี `signal`, `in_sample`, `out_of_sample`, `expected_sign`, `kill_criteria`
   และ `status: preregistered` ก่อนรัน experiment แรก ห้ามแก้ kill_criteria หลังเห็นผล
4. **ทุกการรันคือ 1 trial**: ทุก experiment ต้องมีไฟล์ใน `experiments/` แม้ผลจะแย่ ห้ามลบ experiment ที่ล้มเหลว
5. **Graveyard เป็นสถานะ**: hypothesis ที่ไม่รอดให้ตั้ง `status: rejected` พร้อม `rejected_reason` ห้ามลบไฟล์
6. **แยก fact / interpretation / open question** ใน source note ของ paper และอ้างเลขหน้าเสมอ
7. **ระวัง look-ahead จาก LLM**: ห้ามให้ LLM "ทำนาย" หรือให้คะแนนข้อมูลในอดีตแล้วนำไป backtest เพราะ training data
   รู้อนาคตของช่วงนั้นแล้ว
8. ตรวจความถูกต้องของ vault ด้วย `python scripts/wiki_lint.py` (deterministic) ไม่ใช้การกวาดตาของ AI

## โครงสร้าง
| โฟลเดอร์ | เก็บอะไร |
|---|---|
| `raw/` | metadata ของแหล่งข้อมูล ลิงก์ และโน้ตดิบของเรา |
| `articles/` | บทความอ่านเข้าใจสำหรับคนทั่วไป: อธิบาย paper ทั้งเรื่อง และรายงานงานวิจัยของเรา (`type: article`) |
| `papers/` | source note 1 ไฟล์ต่อ 1 paper (`type: paper`) |
| `concepts/` | แนวคิดที่ใช้ซ้ำได้ (`type: concept`) |
| `hypotheses/` | สมมติฐาน alpha (`type: hypothesis`) |
| `experiments/` | ผล backtest 1 ไฟล์ต่อ 1 รัน (`type: experiment`) |
| `factors/` | factor ที่ผ่าน Reviewer gate แล้ว (`type: factor`) |
| `templates/` | template ของทุก type |
| `scripts/` | lint, backtest |

## บทความ (`articles/`) กับ source note (`papers/`)
- **บทความ** เล่าเป็นเรื่องให้คนทั่วไปเข้าใจ paper ทั้งชิ้น หรืออธิบายงานวิจัยของเราตั้งแต่คำถามถึงวิธีทำ
  ส่วน **source note** คือตาราง claim สั้นพร้อมเลขหน้า ใช้ตรวจและอ้างอิงใน hypothesis
- ทุกข้อเท็จจริงจาก paper ในบทความต้องตรวจกับต้นฉบับและใส่เลขหน้า ถ้าอ่านได้แค่ abstract ให้ตั้ง `basis: abstract`
  และเขียนเฉพาะสิ่งที่ abstract รองรับ ห้ามเติมจากความจำของ LLM
- เขียนด้วยคำของเราเอง ห้ามคัดลอกย่อหน้าหรือตารางจาก paper ปิดท้ายด้วยเครดิตและ DOI
- **ห้ามพิมพ์ตัวเลขผล backtest ในบทความ** ใช้ code block ` ```ledger ` ตามด้วย id ของ hypothesis
  แล้ว dashboard จะแสดงตารางผลล่าสุดจาก experiment ให้เอง

## Schema
frontmatter เป็น key ระดับบนสุดเท่านั้น (flat) ห้ามซ้อน object เพราะ Obsidian Properties/Bases ใช้ไม่ได้
ดู field ที่บังคับใน `templates/` และ `scripts/wiki_lint.py`

## Workflow
`paper (queued → ingested → reviewed)` + `article` (อธิบาย paper) → `hypothesis (idea → preregistered → testing → promoted | rejected)`
→ `experiment (reviewer_verdict: pending → pass | fail)` → `factor`

## ภาษา
เขียนภาษาไทย คงศัพท์เทคนิคเป็นภาษาอังกฤษ ไฟล์ทั้งหมดใช้ชื่อ kebab-case ภาษาอังกฤษ

> เนื้อหาใน vault นี้เพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน
