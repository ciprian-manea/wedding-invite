---
name: milestone
description: Work through one milestone from docs/TASKS.md end to end - plan, build, verify, tick boxes, commit. Use when the user says "/milestone N" or asks to do the next milestone.
argument-hint: [milestone number, e.g. 1]
disable-model-invocation: true
---

Work on milestone M$ARGUMENTS from docs/TASKS.md.

1. Read docs/TASKS.md and every doc the milestone depends on (docs/OPENING_SEQUENCE.md for M1,
   docs/SECTIONS.md and docs/DESIGN_SYSTEM.md for M2–M3, docs/ASSETS.md for M5).
2. Check the current code against the milestone's unticked boxes. Do not redo ticked work.
3. Write a short plan: files to create or change, in order, and how each box will be verified.
   Stop and wait for the user's approval of the plan.
4. Implement box by box. After each box: typecheck, then look at the result at 390x844 with the
   Playwright MCP. Fix before moving on. Tick the box in docs/TASKS.md.
5. When all boxes are ticked: run `npm run lint`, `npm run typecheck`, `npm run build` and the Playwright tests.
6. Use the mobile-qa subagent for the milestone's acceptance checks, then the spec-reviewer subagent
   to compare the diff with the docs. Fix only gaps that affect correctness or the spec.
7. If you made a design or library decision, append it to docs/DECISIONS.md.
8. Show the user: the screenshots, the commands run and their results, and what the user must check on a real phone.
9. Commit with a message like `M$ARGUMENTS: <summary>`.
