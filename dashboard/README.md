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
| ภาพรวม `/` | จำนวน hypothesis / experiment / paper, experiment ล่าสุด, รายการที่รอ Reviewer, local graph ของ hypothesis ที่กำลังทดสอบ |
| Research Board `/board` | hypothesis แยกตาม status: idea → preregistered → testing → promoted และ **Graveyard** (`rejected` พร้อม `rejected_reason`) |
| Experiment Ledger `/ledger` | ทุก trial ของทุก hypothesis เรียงตาม Sharpe, t-stat, trial, annual return, max drawdown ได้ กรอง in-sample / out-of-sample ได้ |
| คลังความรู้ `/library` | ตารางโน้ตทั้งหมด กรองตามประเภทและสถานะการตรวจ |
| Graph View `/graph` | กราฟจาก `[[wikilink]]` จริงในโน้ต (แบบ Obsidian) |
| `/read/<slug>` | อ่านโน้ตฉบับเต็ม wikilink กดไปโน้ตปลายทางได้ |

สีของประเภทโน้ต: hypothesis ส้ม · experiment ฟ้า · factor ม่วง · concept เขียว · paper เทา
ขอบสีส้มในกราฟ = ยังไม่ผ่านการตรวจ (paper ที่ยังไม่ได้เทียบกับ full text หรือ experiment ที่ verdict ยัง `pending`)

## เปลี่ยนอะไรจากต้นทาง

- **indexer** (`scripts/build-wiki-index.mjs`) อ่านโฟลเดอร์และ type ของ vault นี้แทน `02-Wiki/*` และส่งข้อมูล
  `research.hypotheses` / `research.experiments` (frontmatter แบบ flat) ให้ Board และ Ledger ส่วน reader, graph และ search ใช้ logic เดิม
- **ตัด market chart, earnings scorecard และ watchlist ออก** เพราะงานวิจัยนี้ไม่ได้ติดตามหุ้นรายตัว และสคริปต์เดิม
  ดึงข้อมูลจากเน็ตทุกครั้งที่ build ทำให้ build ช้าและพังได้เมื่อไม่มีเน็ต ราคาที่ใช้วิจัยอยู่ในขั้น backtest แล้ว
- เพิ่ม 2 หน้า: Research Board และ Experiment Ledger

## ข้อควรรู้

- `data/` และ `public/vault-assets/` สร้างจาก vault ตอนรัน ห้าม commit (อยู่ใน `.gitignore`)
- dashboard ไม่ตัดสินอะไรเอง verdict และ status ต้องมาจาก Reviewer และ `/log-experiment` ใน vault
