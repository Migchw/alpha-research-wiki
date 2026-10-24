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

## สถานะ full text
- ทั้งสอง paper เป็น `closed` ตาม OpenAlex ไม่มี repository ไหนมี full text ฟรี
- หน้าเว็บของ Novy-Marx ลิงก์ paper นี้ไปที่ ScienceDirect เท่านั้น
- ระหว่างค้นพบว่า Novy-Marx เปิดให้โหลด "Backtesting strategies based on multiple signals" ฟรีบนเว็บของผู้เขียน
  ซึ่งเกี่ยวกับ EP5 (overfitting) — ยังไม่ได้ตรวจ metadata
