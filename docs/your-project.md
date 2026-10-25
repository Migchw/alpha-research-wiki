# เริ่ม wiki ของ Hands-on project + การบ้าน EP8

## 1. สร้าง repo ของตัวเอง

กด **Use this template** บนหน้า GitHub ของ repo นี้ (หรือ clone แล้วเปลี่ยน remote) ตั้งเป็น private ได้

```bash
git clone https://github.com/<you>/<your-project>.git
cd <your-project>
pip install -r requirements.txt
python scripts/wiki_lint.py        # ต้องได้ PASS
```

## 2. เลือกว่าจะเก็บตัวอย่าง H-001 ไว้ไหม

**แบบ A: เก็บไว้เป็นตัวอย่าง (แนะนำสำหรับการบ้าน)** ไม่ต้องลบอะไร ตั้ง id ของตัวเองต่อจากของเดิม (`H-002`, `E-004` …)
แล้วดู H-001 เป็นแบบอย่างได้ตลอด

**แบบ B: เริ่มจาก vault ว่าง** (สำหรับ project จริงที่จะส่ง mentor) ลบโน้ตตัวอย่างตามรายการนี้

```bash
git rm hypotheses/*.md experiments/*.md papers/*.md concepts/*.md articles/*.md
git rm reading-list.md raw/2026-10-24-citation-check.md
git rm -r facts
python scripts/wiki_lint.py        # PASS: 0 error(s)
```

ต้องลบ `reading-list.md` ด้วย เพราะมันลิงก์ไปหา paper ตัวอย่าง ถ้าลบ paper แต่เก็บไฟล์นี้ lint จะ fail เพราะ wikilink เสีย
(เราทดสอบบนสำเนาเมื่อ 2026-10-25: lint ผ่าน และ dashboard `npm run index` + `npm run build` ผ่านกับ vault ว่าง ทุกหน้าเปิดได้)
`templates/`, `scripts/`, `.claude/` และ `dashboard/` เก็บไว้ทั้งหมด

## 3. ดูความคืบหน้าบน dashboard

```bash
cd dashboard
npm install
npm run dev        # http://localhost:3000 · แก้โน้ตแล้วรัน npm run index ใหม่
```

- **Research Board** `/board`: hypothesis ทุกตัวแยกตาม status รวม Graveyard ใช้คุยกับ mentor ว่าตอนนี้อยู่ตรงไหน
- **Experiment Ledger** `/ledger`: ทุก trial พร้อม Sharpe, t-stat และ verdict
- **Graph** `/graph`: ดูว่า hypothesis ยึดกับ paper และ concept ไหน

## การบ้าน EP8: ingest 1 paper + register 1 hypothesis

ใช้หัวข้อ Hands-on project ของตัวเอง ไม่ต้องเป็น momentum

1. **เลือก paper 1 ชิ้น** ที่เกี่ยวกับ project หา DOI และฉบับที่อ่านได้ฟรี (`/find-paper` หรือทำตาม
   `.claude/skills/find-paper/SKILL.md`) วาง PDF ไว้ที่ `raw/pdf/` (ไม่ถูก commit)
2. **ingest** ด้วย `/ingest-paper <citekey>` หรือเขียนเองจาก `templates/Paper.md`
   - `status: ingested` · มี claim อย่างน้อย 5 ข้อ แยก fact / interpretation / open question
   - ทุก claim มีเลขหน้า และ **คุณเปิดต้นฉบับตรวจเองแล้วทุกข้อ**
3. **register hypothesis 1 ตัว** จาก `templates/Hypothesis.md` ตั้ง `status: preregistered` และกรอกให้ครบ:
   `source_papers` (ลิงก์ paper ข้อ 2), `signal`, `universe`, `in_sample`, `out_of_sample`, `expected_sign`
   และ `kill_criteria` ที่เป็นตัวเลข เช่น "OOS t-stat < 1.5"
   เขียนส่วน "ทำไมถึงคิดว่าน่าจะใช้ได้ (กลไก)" ด้วยคำของตัวเอง 3–5 บรรทัด
4. **ตรวจ** `python scripts/wiki_lint.py` ต้องได้ `PASS` แล้ว commit

**ยังไม่ต้องรัน backtest** `scripts/backtest_momentum.py` ทำได้แค่ momentum บน SET100 ของ H-001
project ของคุณต้องเขียนสคริปต์ทดสอบเอง และต้องให้สคริปต์นั้นเขียนผลลง `experiments/` ตาม `templates/Experiment.md`

### เช็คก่อนส่ง
- [ ] `python scripts/wiki_lint.py` → `PASS`
- [ ] paper มี DOI ที่ตรวจกับ Crossref แล้ว และไม่มี PDF ใน `git ls-files`
- [ ] hypothesis ขึ้นในคอลัมน์ preregistered ของ Research Board
- [ ] kill criteria เขียนก่อนเห็นผลใดๆ และจะไม่แก้หลังจากนี้

ไม่มี Claude แบบเสียเงิน: ดู [ทางเลือกฟรี](free-alternatives.md)

> เนื้อหาเพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน
