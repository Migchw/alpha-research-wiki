---
type: hypothesis
id: H-001
status: preregistered
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
[[novy-marx-2012]] เสนอว่าผลตอบแทนของ momentum มาจากช่วงกลาง (เดือน t-12 ถึง t-7) มากกว่าช่วงล่าสุด
เทียบกับ baseline 12-1 ของ [[jegadeesh-titman-1993]] (*to verify กับต้นฉบับก่อนใช้ในสไลด์*)

คำถามคือ ผลนี้ยังอยู่ในตลาดที่มีขนาดเล็กและสภาพคล่องต่ำกว่าอย่าง SET100 หรือไม่

## Pre-registration (เขียนก่อนรัน experiment แรก ห้ามแก้หลังเห็นผล)
- Signal: ผลตอบแทนสะสมเดือน t-12..t-7 ข้ามเดือน t-1 เทียบกับ baseline 12-1
- Universe: SET100 (รายชื่อปัจจุบัน; **มี survivorship bias โดยตั้งใจ** เพื่อใช้สอน)
- In-sample 2010-01..2019-12 / Out-of-sample 2020-01..2025-12
- Portfolio: quintile long-short, rebalance รายเดือน, ค่าธรรมเนียม 30 bps ต่อด้าน
- Expected sign: positive (Q5 − Q1 > 0)
- Kill criteria: OOS t-stat < 1.5 หรือ Sharpe < 0.3 หลังหักค่าธรรมเนียม

## Experiments
- [[E-001]]: baseline 12-1 (in-sample)

## Verdict
ยังไม่มี — รอผล experiment และ [[reviewer-gate|Reviewer]]
