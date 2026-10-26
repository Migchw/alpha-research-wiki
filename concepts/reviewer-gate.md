---
type: concept
title: "Reviewer gate"
tags: [concept, process]
created: 2026-10-24
---

# Reviewer gate

## นิยาม
จุดตรวจก่อนเชื่อผล experiment: subagent `reviewer` ตรวจ look-ahead bias, survivorship bias,
จำนวน trial (multiple testing), data snooping และว่าตัวเลขมาจากสคริปต์จริง แล้วตัดสิน `pass` หรือ `fail`

## ทำไมสำคัญกับ alpha research
LLM ทำให้ลอง config ใหม่ได้เร็วมาก จึงยิ่งต้องมี gate ที่นับและตรวจทุก trial (เชื่อมกับ Module 8)
