# เริ่ม wiki ของ Hands-on project + การบ้าน EP8

> vault ที่สร้างตามคลิปตั้งแต่ EP2 ใช้ต่อได้เลย ส่วนข้อ 1 ด้านล่างสำหรับคนที่อยากเริ่มจากเฉลย

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
git rm raw/2026-10-24-citation-check.md
git rm -r facts
cp templates/Reading-list.md reading-list.md     # แทนที่ด้วยตารางว่าง
python scripts/wiki_lint.py        # PASS: 0 error(s)
```

- ต้องแทน `reading-list.md` ด้วยตารางว่าง เพราะของเดิมลิงก์ไปหา paper ตัวอย่าง ถ้าลบ paper แต่เก็บไฟล์เดิม lint จะ fail
  เพราะ wikilink เสีย และห้ามลบทิ้งเฉยๆ เพราะ `/find-paper` กับ `/ingest-paper` บันทึกสถานะ paper ลงไฟล์นี้
- `/ingest-paper` ใช้ `papers/jegadeesh-titman-1993.md` เป็นตัวอย่างมาตรฐาน ซึ่งแบบ B ลบไปแล้ว ถ้าจะ ingest ครั้งแรก
  ให้ทำแบบ A ก่อน หรือเปิดไฟล์ตัวอย่างจาก repo ต้นฉบับบน GitHub ประกอบ
- `templates/`, `scripts/`, `.claude/` และ `dashboard/` เก็บไว้ทั้งหมด
- เราทดสอบบนสำเนาเมื่อ 2026-10-25: lint ผ่าน และ dashboard `npm run index` + `npm run build` ผ่านกับ vault ว่าง ทุกหน้าเปิดได้

## 3. ดูความคืบหน้าบน dashboard

```bash
cd dashboard
npm install
npm run dev        # http://localhost:3000 · แก้โน้ตแล้วรัน npm run index ใหม่
```

- **Research Board** `/board`: hypothesis ทุกตัวแยกตาม status รวม Graveyard ใช้คุยกับ mentor ว่าตอนนี้อยู่ตรงไหน
- **Experiment Ledger** `/ledger`: ทุก trial พร้อม Sharpe, t-stat และ verdict
- **Graph** `/graph`: ดูว่า hypothesis ยึดกับ paper และ concept ไหน

## การบ้าน EP8: ingest 1 เอกสาร + ถาม vault 1 คำถาม

ใช้ vault ที่สร้างตามคลิป (หรือ repo จาก Use this template) และหัวข้อของตัวเอง ไม่ต้องเป็น momentum

1. **เลือกเอกสาร 1 ชิ้น** อย่างใดอย่างหนึ่ง
   - paper ที่เกี่ยวกับ project (หาไอเดียได้จาก [ML-Quant](https://www.ml-quant.com) หรือ `reading-list.md`)
     ตรวจ DOI และหาฉบับฟรีด้วย `/find-paper` แล้ววาง PDF ที่ `raw/pdf/`
   - เอกสารบริษัทที่สนใจ: 56-1 One Report (เว็บ IR หรือ market.sec.or.th) · 10-K / 10-Q (SEC EDGAR)
     วางที่ `raw/sources/<source-id>.<pdf|htm>`
2. **ingest** ด้วย `/ingest-paper <citekey>` หรือ `/ingest-source <source-id>`
   - `status: ingested` · source ต้องมี `published` (วันที่เผยแพร่ ไม่ใช่วันสิ้นงวด)
   - claim อย่างน้อย 5 ข้อ แยก fact / interpretation (ผู้เขียนหรือบริษัท) / interpretation (เรา) / open question
   - ทุก claim มีที่มา (หน้า · Item · `[mm:ss]`) และ **คุณเปิดต้นฉบับตรวจเองอย่างน้อย 3 ข้อ**
3. **ถาม vault 1 คำถาม** ด้วย `/ask-wiki <คำถาม>` เกี่ยวกับเอกสารข้อ 1 แล้วเก็บคำตอบเป็น `articles/<slug>.md`
   (`basis: vault`, `status: draft`) ทุกประโยคมีลิงก์ source และมีหัวข้อ "vault ยังไม่มี"
4. **ตรวจ** `python scripts/wiki_lint.py` ต้องได้ `PASS` แล้ว commit

**งานเสริมสำหรับสาย quant:** register hypothesis 1 ตัวจาก `templates/Hypothesis.md` (`status: preregistered`
พร้อม `kill_criteria` ที่เป็นตัวเลข) · ยังไม่ต้องรัน backtest เพราะ `scripts/backtest_momentum.py` ทำได้แค่ H-001

### เช็คก่อนส่ง
- [ ] `python scripts/wiki_lint.py` → `PASS`
- [ ] ไม่มี PDF หรือข้อความเต็มใน `git ls-files` (paper: DOI ตรวจกับ Crossref แล้ว)
- [ ] บทความจาก `/ask-wiki` ทุกประโยคชี้กลับไปที่ source

ไม่มี Claude แบบเสียเงิน: ดู [ทางเลือกฟรี](free-alternatives.md)

> เนื้อหาเพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน
