# Alpha Research Desk (dashboard)

Dashboard แบบ **read-only** สำหรับ vault นี้ อ่าน Markdown + frontmatter ใน `papers/`, `concepts/`, `hypotheses/`,
`experiments/` และ `factors/` แล้วแสดงผลเป็นเว็บในเครื่อง ไม่แก้ไฟล์ใน vault เลย ทุกตัวเลขที่เห็นมาจาก frontmatter
ที่ `scripts/backtest_momentum.py` เขียนไว้

ดัดแปลงจาก Wiki Market Desk (Next.js บน vinext) ของ `llm-wiki-starter`

## เริ่มใช้งาน

ต้องมี Node.js 22.13 ขึ้นไป

```bash
cd dashboard
npm install
npm run dev        # เปิด http://localhost:3000 (สร้าง index จาก vault ให้ก่อนทุกครั้ง)
```

คำสั่งอื่น

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run index` | อ่าน vault แล้วเขียน `data/wiki-index.json` + `data/search-index.json` (ไม่ commit) |
| `npm run build` | index + build production |
| `npm run start` | รัน build ที่สร้างแล้ว |
| `npm run lint` | ESLint |

หลังรัน backtest หรือแก้โน้ต ให้รัน `npm run index` ใหม่ (หรือ restart `npm run dev`) แล้ว refresh หน้าเว็บ

ถ้าเก็บ vault ไว้ที่อื่น ให้คัดลอก `.env.example` เป็น `.env.local` แล้วตั้ง `WIKI_VAULT_PATH`

## หน้าต่างๆ

| หน้า | ใช้ทำอะไร |
|---|---|
| บทความ `/articles` | **เริ่มอ่านที่นี่** บทความอธิบาย paper และรายงานงานวิจัยแบบเล่าเป็นเรื่อง (โฟลเดอร์ `articles/` ใน vault) |
| ภาพรวม `/` | จำนวน hypothesis / experiment / paper, experiment ล่าสุด, รายการที่รอ Reviewer, local graph ของ hypothesis ที่กำลังทดสอบ |
| Research Board `/board` | hypothesis แยกตาม status: idea → preregistered → testing → promoted และ **Graveyard** (`rejected` พร้อม `rejected_reason`) |
| Experiment Ledger `/ledger` | ทุก trial ของทุก hypothesis เรียงตาม Sharpe, t-stat, trial, annual return, max drawdown ได้ กรอง in-sample / out-of-sample ได้ |
| คลังความรู้ `/library` | ตารางโน้ตทั้งหมด กรองตามประเภทและสถานะการตรวจ |
| Graph View `/graph` | กราฟจาก `[[wikilink]]` จริงในโน้ต (แบบ Obsidian) |
| Paper Feed `/feed` | paper ใหม่จาก [ML-Quant](https://www.ml-quant.com) (ค่าเริ่มต้นหัวข้อ Asset Pricing & Factors) ติดป้ายถ้ามีใน vault แล้ว · ปุ่มคัดลอกคำสั่ง `/find-paper` ไปวางใน agent |
| `/read/<slug>` | อ่านโน้ตฉบับเต็ม หน้า experiment / hypothesis / paper มีกล่องอธิบายภาษาง่ายด้านบน (สร้างจาก frontmatter) |

สีของประเภทโน้ต: hypothesis ส้ม · experiment ฟ้า · factor ม่วง · concept เขียว · paper เทา
ขอบสีส้มในกราฟ = ยังไม่ผ่านการตรวจ (paper ที่ยังไม่ได้เทียบกับ full text หรือ experiment ที่ verdict ยัง `pending`)

## เปลี่ยนอะไรจากต้นทาง

- **indexer** (`scripts/build-wiki-index.mjs`) อ่านโฟลเดอร์และ type ของ vault นี้แทน `02-Wiki/*` และส่งข้อมูล
  `research.hypotheses` / `research.experiments` (frontmatter แบบ flat) ให้ Board และ Ledger ส่วน reader, graph และ search ใช้ logic เดิม
- **ตัด market chart, earnings scorecard และ watchlist ออก** เพราะงานวิจัยนี้ไม่ได้ติดตามหุ้นรายตัว และสคริปต์เดิม
  ดึงข้อมูลจากเน็ตทุกครั้งที่ build ทำให้ build ช้าและพังได้เมื่อไม่มีเน็ต ราคาที่ใช้วิจัยอยู่ในขั้น backtest แล้ว
- เพิ่ม 2 หน้า: Research Board และ Experiment Ledger

## Paper Feed

dashboard ไม่ดึงข้อมูลจากเน็ตเอง (build ต้องทำงานได้แม้ออฟไลน์) ให้ดึง feed ด้วยมือจาก root ของ repo:

```bash
python scripts/paper_feed.py --topic asset-pricing-factors --limit 20   # → dashboard/data/paper-feed.json (ไม่ commit)
cd dashboard && npm run index
```

- หัวข้ออื่นดูได้ที่ https://www.ml-quant.com/api/v1/topics.json (เช่น `llms-text`, `portfolio-allocation`)
- สคริปต์เว้น 1 วินาทีต่อ request และไม่ดึงหน้าที่มีอยู่แล้วซ้ำ
- สรุปหนึ่งประโยคเป็นของ ML-Quant (CC BY 4.0 ลิงก์กลับทุกรายการ) **ยังไม่ได้ตรวจกับต้นฉบับ** ใช้หาไอเดียเท่านั้น
- ปุ่มบนหน้า feed **ไม่เขียนไฟล์** แค่คัดลอก `/find-paper "<ชื่อ>" <ลิงก์>` ให้ไปวางใน Claude Code / agy
  แล้ว `/find-paper` จะตรวจ metadata และเพิ่มลง `reading-list.md` เอง (dashboard เป็น read-only ตาม SPEC)

## ข้อควรรู้

- `npm install` (npm 11) อาจเตือน `allow-scripts` ว่า esbuild, sharp, unrs-resolver และ workerd มี install script ที่ยังไม่อนุญาต
  ไม่ต้องทำอะไร (ทดสอบบน clone ใหม่ 2026-10-25: `npm run index` + `npm run build` ผ่าน และ `npm run start` เปิดได้ทุกหน้า)

- `data/` และ `public/vault-assets/` สร้างจาก vault ตอนรัน ห้าม commit (อยู่ใน `.gitignore`)
- dashboard ไม่ตัดสินอะไรเอง verdict และ status ต้องมาจาก Reviewer และ `/log-experiment` ใน vault
