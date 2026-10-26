---
type: hypothesis
id: H-001
status: testing
source_papers: ["[[novy-marx-2012]]", "[[jegadeesh-titman-1993]]"]
signal: "cumulative return t-12..t-7, skip t-1"
universe: SET100
in_sample: 2010-01..2019-12
out_of_sample: 2020-01..2025-12
expected_sign: positive
kill_criteria: "OOS t-stat < 1.5 หรือ Sharpe < 0.3 หลังหักค่าธรรมเนียม 30 bps"
rejected_reason: ""
tags: [hypothesis, momentum]
created: 2026-10-24
---

# H-001: Intermediate momentum ใช้ได้ในหุ้นไทยไหม

## ทำไมถึงคิดว่าน่าจะใช้ได้ (กลไก)
[[novy-marx-2012]] รายงานว่า momentum ขับเคลื่อนโดยผลงานของหุ้นช่วง 12 ถึง 7 เดือนก่อนสร้างพอร์ตเป็นหลัก
และ signal ช่วงล่าสุดได้ผลน้อยกว่า โดยเฉพาะในหุ้นใหญ่สภาพคล่องสูง เทียบกับ baseline winner-minus-loser
ของ [[jegadeesh-titman-1993]] ดู [[intermediate-horizon-momentum]]
(ตรวจกับ author manuscript ของ Novy-Marx แล้ว 2026-10-25: four-factor alpha ของ 12-7 = 0.43% ต่อเดือน (t 3.00) ส่วน 6-2 ≈ 0 ·
ส่วนต่างของผลตอบแทนดิบ t = 1.78 · MS p. 13–15 · paper เทียบกับ 6-2 ไม่ใช่ 12-1 แบบที่เราเทียบ)

คำถามคือ ผลนี้ยังอยู่ในตลาดที่มีขนาดเล็กและสภาพคล่องต่ำกว่าอย่าง SET100 หรือไม่

หมายเหตุ (2026-10-26): สมมติฐานทางเลือกจาก [[chui-titman-wei-2010]] ไทยมี individualism ต่ำ (Indv 20) และ momentum 6-1 ของหุ้นไทยทั้งตลาด
ปี 1988–2003 ได้ 0.479% ต่อเดือน (t 1.10) ไม่มีนัยสำคัญ (MS p. 30, 33) ถ้ากลไกของ paper ถูก momentum ใน SET100 ก็อาจอ่อนไม่ว่าจะใช้ช่วงไหน
(หมายเหตุนี้ไม่เปลี่ยน signal หรือ kill criteria)

## Pre-registration (เขียนก่อนรัน experiment แรก ห้ามแก้หลังเห็นผล)
- Signal: ผลตอบแทนสะสมเดือน t-12..t-7 ข้ามเดือน t-1 เทียบกับ baseline 12-1
- Universe: SET100 (รายชื่อปัจจุบัน; **มี survivorship bias โดยตั้งใจ** เพื่อใช้สอน)
- In-sample 2010-01..2019-12 / Out-of-sample 2020-01..2025-12
- Portfolio: quintile long-short, rebalance รายเดือน, ค่าธรรมเนียม 30 bps ต่อด้าน
- Expected sign: positive (Q5 − Q1 > 0)
- Kill criteria: OOS t-stat < 1.5 หรือ Sharpe < 0.3 หลังหักค่าธรรมเนียม

## Experiments
- [[E-001]]: baseline 12-1 (in-sample) · trial 1
- [[E-002]]: intermediate 12-7 (in-sample) · trial 2
- [[E-003]]: baseline 12-1 (out-of-sample, `--force-oos` ก่อนผ่าน Reviewer) · trial 3

## Verdict
ยังไม่มี — รอผล experiment และ [[reviewer-gate|Reviewer]]
