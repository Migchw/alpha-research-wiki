---
type: paper
citekey: jegadeesh-titman-1993
title: "Returns to Buying Winners and Selling Losers: Implications for Stock Market Efficiency"
authors: [Narasimhan Jegadeesh, Sheridan Titman]
year: 1993
journal: "The Journal of Finance"
volume: 48
issue: 1
pages: "65-91"
doi: "10.1111/j.1540-6261.1993.tb04702.x"
url: "https://doi.org/10.1111/j.1540-6261.1993.tb04702.x"
access: paywalled
verified_against: fulltext
status: ingested
tags: [paper, momentum]
created: 2026-10-24
---

# Jegadeesh & Titman (1993) — Returns to Buying Winners and Selling Losers

> ตรวจกับ full text ฉบับตีพิมพ์ (สำเนา JSTOR) เมื่อ 2026-10-24 · เลขหน้าเป็นเลขหน้าของวารสาร
> full text เก็บไว้ในเครื่องเท่านั้น ไม่ได้ commit

## สรุป 3 บรรทัด
- ซื้อหุ้นที่ผลงานอดีตดี และขายหุ้นที่ผลงานอดีตแย่ ได้ผลตอบแทนบวกอย่างมีนัยสำคัญเมื่อถือ 3–12 เดือน (หุ้น NYSE/AMEX ปี 1965–1989)
- กลยุทธ์หลัก 6-month/6-month ได้ผลตอบแทนส่วนเกินทบต้นเฉลี่ย 12.01% ต่อปี และกำไรนี้ไม่ได้มาจาก systematic risk
- ผลตอบแทนส่วนเกินของปีแรกหายไปครึ่งหนึ่งภายใน 2 ปีถัดมา

## Claim table
| # | Claim | ประเภท | หลักฐาน |
|---|---|---|---|
| 1 | กลุ่มตัวอย่างคือหุ้น NYSE และ AMEX ช่วง 1965–1989 ข้อมูลจาก CRSP | fact | p. 67, 69 |
| 2 | สร้างพอร์ตแบบ J-month/K-month: จัดอันดับด้วยผลตอบแทน J เดือนที่ผ่านมา แล้วถือ K เดือน (J, K = 3, 6, 9, 12) รวม 16 กลยุทธ์ และอีก 16 กลยุทธ์ที่ **เว้น 1 สัปดาห์** ระหว่าง formation กับ holding เพื่อลดผลของ bid-ask spread และ price pressure | fact | p. 68 |
| 3 | ผลตอบแทนของพอร์ต zero-cost (winners − losers) เป็นบวกทุกกลยุทธ์ และมีนัยสำคัญทุกตัว ยกเว้น 3/3 ที่ไม่เว้นสัปดาห์ | fact | p. 69, Table I (p. 70) |
| 4 | ผู้เขียนคำนึงถึงการทดสอบ **32 ครั้ง** โดยใช้ Bonferroni inequality: t-stat 4.28 ของกลยุทธ์ 12/3 ที่เว้นสัปดาห์ มีโอกาสเกิดโดยบังเอิญน้อยกว่า 0.0006 | fact | p. 69 |
| 5 | กลยุทธ์ที่ดีที่สุดคือ 12/3: 1.31% ต่อเดือนแบบไม่เว้น และ 1.49% ต่อเดือนแบบเว้น 1 สัปดาห์ | fact | p. 69 |
| 6 | กลยุทธ์ 6/6 ได้ผลตอบแทนส่วนเกินทบต้นเฉลี่ย 12.01% ต่อปี | fact | p. 89 |
| 7 | ผลตอบแทนติดลบในเดือนมกราคม ส่วนเดือนอื่นเฉลี่ย 1.66% ต่อเดือน · ได้ผลบวก 67% ของเดือนทั้งหมด (71% เมื่อไม่นับมกราคม) | fact | p. 79 |
| 8 | ครึ่งหนึ่งของผลตอบแทนส่วนเกินในปีแรกหายไปภายใน 2 ปีถัดมา | fact | p. 89 |
| 9 | ทดสอบย้อนหลังก่อนปี 1965 (ช่วง 1927–1940 และ 1941–1964) | fact | Section VII, p. 85 |
| 10 | ผลตอบแทนรอบประกาศงบ (ช่วง 1980–1989 จาก COMPUSTAT) มีรูปแบบคล้ายกัน | fact | p. 87 |
| 11 | กำไรนี้ไม่ได้มาจาก systematic risk หรือ delayed reaction ต่อ common factors | interpretation (ของผู้เขียน) | abstract, p. 89 |
| 12 | ข้อ 8 และ 10 ชี้ว่าเป็น underreaction แล้วตามด้วยการกลับตัวบางส่วน | interpretation (ของเรา) | ต้องอ่านเหตุผลของผู้เขียนเพิ่ม |

## วิธีการ (data, universe, period, signal)
- Data: CRSP daily ช่วง ก.ค. 1962 – ธ.ค. 1989 นำมาทบต้นเป็นรายเดือน (p. 69 เชิงอรรถ 4)
- Universe: NYSE + AMEX ทุกตัวที่มีผลตอบแทนครบ J เดือนก่อนสร้างพอร์ต (p. 69)
- Signal: ผลตอบแทนสะสม J เดือน · decile · พอร์ตแบบ overlapping (ถือพร้อมกัน K รุ่น) (p. 68)

## ใช้กับงานเราอย่างไร
- hypothesis ที่เกี่ยวข้อง: H-001 (ยังไม่ได้ลงทะเบียน) (baseline ของ E-001)
- concept ที่เกี่ยวข้อง: [[cross-sectional-momentum]]
- **เชื่อมกับ EP5 / Module 8:** ตั้งแต่ปี 1993 ผู้เขียนก็นับว่าทดสอบไป 32 แบบ และปรับด้วย Bonferroni แล้ว (claim 4) ซึ่งเป็นเหตุผลเดียวกับการเก็บ `trial_no` ในทุก experiment

## Open questions
- การเว้น 1 สัปดาห์ในงานนี้ ต่างจาก "skip 1 เดือน" ที่ใช้กันในงานยุคหลังอย่างไร และควรใช้แบบไหนกับ SET
- ผลมกราคมที่ติดลบ (claim 7) มีในตลาดไทยหรือไม่
