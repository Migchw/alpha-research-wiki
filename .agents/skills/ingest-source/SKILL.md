---
name: ingest-source
description: อ่านเอกสารบริษัทหรือคลิป (56-1 One Report, 10-K, 10-Q, MD&A, transcript ของ earnings call / opportunity day) แล้วเขียน source note ใน sources/ พร้อมที่มาทุกข้อ (หน้า · หัวข้อ · นาที) และอัปเดตหน้าบริษัทใน companies/ ใช้เมื่อผู้ใช้สั่ง /ingest-source หรือขอ "ingest 56-1", "สรุป 10-K เข้า wiki"
argument-hint: <source-id> เช่น delta-56-1-2025 | nflx-10k-2025 | nflx-earnings-interview-2026q3
---
<!-- สร้างจาก .claude/skills/ingest-source/SKILL.md ด้วย scripts/sync_skills.py ห้ามแก้ไฟล์นี้ตรงๆ ให้แก้ต้นฉบับแล้วรันสคริปต์ใหม่ -->

# /ingest-source

อ่าน `AGENTS.md` ก่อน กติกาข้อ 1, 2, 6, 7 และ 9 ใช้กับ skill นี้ทุกข้อ

## 0. เตรียมต้นฉบับ
- ต้นฉบับอยู่ใน `raw/sources/<source-id>.<pdf|htm|txt|vtt>` (gitignored) ถ้าไม่มี ให้บอกผู้ใช้ว่าต้องโหลดจากไหน แล้วหยุด
  - 10-K / 10-Q: SEC EDGAR (`sec.gov/cgi-bin/browse-edgar`) · 56-1 One Report: เว็บนักลงทุนสัมพันธ์ของบริษัท หรือ SEC ไทย
  - คลิป: ถ้ามีคำบรรยายใช้ไฟล์ .vtt ถ้าไม่มีให้ถอดเสียงในเครื่อง (เช่น faster-whisper) แล้วบันทึกว่าเป็น machine transcript
- แปลงเป็นข้อความ: `python scripts/source_to_text.py raw/sources/<ไฟล์>` ได้ `<source-id>.source.txt` ที่มี locator
  `=== pdf page N ===` · `=== section: Item 7 ... ===` · `[mm:ss]` และ sha256 ของต้นฉบับ
- เอกสาร PDF: ดูว่าเลขหน้าที่พิมพ์ต่างจากลำดับหน้า PDF เท่าไร แล้วใช้ **เลขหน้า PDF** ตลอดทั้ง note (เขียนไว้ในหัว note)

## 1. อ่านตามโครงของเอกสาร ไม่ต้องอ่านทุกหน้าเท่ากัน
| ชนิด | ส่วนที่ต้องอ่าน |
|---|---|
| 56-1 One Report | 1.1–1.2 ธุรกิจและโครงสร้างรายได้ · 2 การบริหารความเสี่ยง · 4 MD&A · งบการเงินเฉพาะตัวเลขที่ MD&A อ้าง |
| 10-K | Item 1 Business · Item 1A Risk Factors · Item 7 MD&A |
| 10-Q | Part I Item 2 MD&A · ส่วนที่เปลี่ยนจาก 10-K ล่าสุด |
| transcript | คำถามของนักวิเคราะห์และคำตอบ ทีละคำถาม พร้อม `[mm:ss]` |
จด claim ledger ระหว่างอ่าน: ข้อความ · ที่มา · ประเภท ห้ามเขียน note ก่อนอ่านส่วนที่ต้องอ่านจบ

## 2. เขียน `sources/<source-id>.md` จาก `templates/Source.md`
- frontmatter ครบ โดยเฉพาะ `published` = วันที่เอกสารเผยแพร่ (SEC filing date · วันที่ส่ง 56-1 · วันที่ไลฟ์) ไม่ใช่วันสิ้นงวด
- สรุป 3 บรรทัด · claim table 8–15 ข้อ ทุกแถวมีที่มา
- ประเภท: `fact` (ตัวเลขหรือข้อเท็จจริงที่เอกสารรายงาน) · `interpretation (บริษัท)` (ผู้บริหารอธิบาย คาดการณ์ หรือให้ guidance)
  · `interpretation (เรา)` · `open question`
- ตัวเลข: คัดตามที่พิมพ์ พร้อมหน่วยและงวด ห้ามคำนวณ % การเติบโตเอง ถ้าเอกสารพิมพ์ไว้ให้คัดของเอกสาร
- transcript จากการถอดเสียงอาจฟังผิด: ตัวเลขจากคลิปต้องเทียบกับ filing หรือ shareholder letter ก่อนเป็น fact
- เขียนด้วยคำของเรา ห้ามคัดลอกย่อหน้า

## 3. อัปเดต `companies/<TICKER>.md` (สร้างจาก `templates/Company.md` ถ้ายังไม่มี)
- เพิ่มแถวใน "สิ่งที่รู้" เฉพาะข้อที่สำคัญ แต่ละแถวลิงก์ `[[<source-id>]]` + ที่มา
- ถ้าขัดกับแถวเดิม: **ห้ามลบของเดิม** เพิ่มทั้งสองฝั่งใน "เอกสารพูดไม่ตรงกัน" พร้อมที่มาและวันที่เผยแพร่
- เพิ่ม source ในรายการ "Sources"

## 4. ตรวจ
- `python scripts/wiki_lint.py` ต้อง PASS
- สุ่ม 3 claim ที่มีตัวเลข แล้ว grep ตัวเลขนั้นใน `.source.txt` ให้เจอใน locator ที่อ้าง รายงานผลให้ผู้ใช้
- `git status` ต้องไม่มีไฟล์ใน `raw/sources/`
