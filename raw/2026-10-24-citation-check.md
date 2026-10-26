---
type: raw
source: "รายการ paper momentum ที่ผู้สอนได้รับมา (ลิงก์บางอันมี utm_source=chatgpt.com)"
checked_with: [Crossref API, OpenAlex API, RePEc]
checked_at: 2026-10-24
---

# Citation check — 2026-10-24

| Paper | DOI ในรายการต้นทาง | ผลตรวจ Crossref | DOI ที่ถูก |
|---|---|---|---|
| Jegadeesh & Titman 1993 | 10.1111/j.1540-6261.1993.tb04702.x | ✅ ตรง (JF 48(1) 65-91) | เหมือนเดิม |
| Novy-Marx 2012 | 10.1016/j.jfineco.2011.08.003 | ❌ คือ "Friends with money" (Engelberg, Gao, Parsons; JFE 103(1) 169-188) | 10.1016/j.jfineco.2011.05.003 (JFE 103(3) 429-453) |

**บทเรียน (ใช้ใน EP6):** DOI ที่ผิดดูน่าเชื่อถือมาก เพราะ prefix วารสาร ปี และเล่มถูกหมด ผิดแค่เลข article
ให้ตรวจทุก citation กับ Crossref (`https://api.crossref.org/works/<doi>`) ก่อนนำเข้า wiki เสมอ

## ไฟล์ "Novy-Marx 2012" ที่ได้มาไม่ใช่ paper
ไฟล์ที่ได้รับผ่าน Google Drive ชื่อ "Is Momentum Really Momentum?" ยาว 2 หน้า หัวเรื่องคือ
"An Academic Review of Robert Novy-Marx's Term Structure…" สร้างด้วย WeasyPrint และมีสูตร LaTeX ดิบ (`$r_{12,7}$`)
หลุดอยู่ในเนื้อหา เป็นลักษณะของสรุปที่ AI เขียน **ไม่ใช่ต้นฉบับ** จึงห้ามใช้เป็นหลักฐาน
(เก็บไว้ในเครื่องที่ `raw/pdf/novy-marx-2012_AI-summary_NOT-SOURCE.pdf` ใช้เป็นตัวอย่างใน EP6)

**บทเรียน:** ต้องตรวจทั้ง citation และ "ตัวเอกสาร" ก่อนนำเข้า ให้ดูจำนวนหน้า ชื่อวารสาร และหน้าแรกที่มีชื่อวารสาร/เล่ม

## สถานะ full text
- Jegadeesh & Titman 1993: ได้สำเนา JSTOR (30 หน้า) และตรวจแล้ว
- Novy-Marx 2012: ยังไม่มีต้นฉบับ
- ทั้งสอง paper เป็น `closed` ตาม OpenAlex ไม่มี repository ไหนมี full text ฟรี
- หน้าเว็บของ Novy-Marx ลิงก์ paper นี้ไปที่ ScienceDirect เท่านั้น
- ระหว่างค้นพบว่า Novy-Marx เปิดให้โหลด "Backtesting strategies based on multiple signals" ฟรีบนเว็บของผู้เขียน
  ซึ่งเกี่ยวกับ EP5 (overfitting) — ยังไม่ได้ตรวจ metadata
