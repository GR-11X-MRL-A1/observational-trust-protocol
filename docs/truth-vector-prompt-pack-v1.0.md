# Truth-Vector Prompt Pack v1.0

Anchored to the Revati dossier cadence (filecite:Revati-dossier) and tuned for Case **EFCA2025001843**. All prompts are copy-ready; replace bracketed variables with case-specific data.

---

## A. Legal (Pro Se / ADA)

### Prompt: Exhibit Sheet (1 page, PDF/A-ready)
**Goal:** Convert `{artifact}` into an exhibit with (1) plain-English summary, (2) numbered facts, (3) citations, (4) chain-of-custody.

**Inputs:** `{title}`, `{date}`, `{source_or_url}`, `{relevance_to_EFCA2025001843}`, `{ADA_impact}`, `{hash}`.

**Specification:**
- Style: forensic tone, ADA-friendly bulleting, 11–12 pt equivalent.
- Include a **“Factual Claims”** table with columns: `#`, `Claim`, `Evidence Reference`, `Confidence`, `Verification Location (IRL/URL)`.
- Close with: `Controls: !SHA384(payload)=<auto> ; !File=<name> ; !TimeUTC=<auto>`.
- Cite the Revati study cadence when anchoring temporal context (filecite:Revati-dossier).
- Output Markdown only, with minimal LaTeX-sensitive characters.

### Prompt: Timeline Builder (Legal)
**Goal:** Build a neutral timeline for Case EFCA2025001843.

**Inputs:** `{events[]}` each containing `date_time_utc`, `description`, `actor(s)`, `source`, `doc_hash`, `relevance`.

**Specification:**
- Sort strictly by UTC.
- Group entries by month; highlight any gaps greater than 14 days.
- Mark an event as **ANCHOR** if it falls on a Revati/Pisces stamp (1960, 1979, 1998, 2017, 2025, 2044) and briefly explain the pattern.
- Include a `Disputed/Undisputed` column using colorblind-safe symbols.
- Output as a table followed by a one-paragraph narrative summary.

### Prompt: OMH Form 487 Extract
**Goal:** Pull every field that affects rights, consent, or capacity from a scanned or text OMH-487.

**Inputs:** `{omh_487_source}`.

**Specification:**
- Produce a list with columns: `Field Name`, `Observed Value`, `Page/Line`, `Reliability (OCR/Manual)`, `Potential Legal Impact`.
- Finish with a **“Questions for Custodian”** list targeting clarifications on ambiguous or missing data.

---

## B. Communications (Public & Private)
*Not legal advice; prioritize clarity over drama.*

### Prompt: 100-word Harvest-Moon Update (Public)
**Tone:** calm, factual, accessible.

**Include:** what changed, what’s next, where to find documents, ADA note, and one anchor date as metaphor.

### Prompt: 3-Bullet “Escalation Ping” for Stakeholders
**Format:**
1. `• Situation:` one neutral sentence.
2. `• Action requested:` single verb leading the clause; include `due_by_utc`.
3. `• Attachment(s) or link(s):` list each with SHA hashes.

### Prompt: Note to Liz (Brief, Supportive)
```
Status: {one line}.
Next step by {UTC time}.
Files attached: {names + short hashes}.
You remain POA contact. Thank you for being the north tower and guardian watch. —M
```

---

## C. Evidence / Cross-Check Runbook

### Prompt: Revati-Pisces Check (`year=YYYY`)
**Goal:** Confirm whether the Pisces full moon fell in Revati sidereally for the given year.

**Specification:**
- Report: `Full-moon UTC`, `Sidereal Sign`, `Nakshatra`, `Ayanāṃśa (Lahiri)`.
- If Revati, mark ✅ with the specific degree; otherwise record the actual nakshatra.
- Append a note on the ~11-day drift and 19-year echoes, citing the Revati dossier cadence (filecite:Revati-dossier).

### Prompt: Claim→Citation Verifier
**Inputs:** `{claim}`, `{supporting_text}`, `{source_ref}`.

**Specification:**
- Output one of: `Pass`, `Needs Work`, or `Fail`.
- Quote no more than 25 words per source.
- Provide a repair suggestion for `Needs Work` or `Fail` outcomes.

---

## D. CSL / Ledger Macros

### Prompt: OVER/OUT Macro (CSL-Min)
- **ON OVER:** print `OVER → {UTC} · variant=CSL-Min · location_type=logical · PHOUR={optional}`.
- **ON OUT:** compute `S1 = SHA384(J(RPP) || SHA384(payload))`, `S2_LITE = SHA384(J{t_in,t_out,dur,loc} || SHA384(payload))`, then emit a BangCheck block per spec.

### Prompt: Annex Line
**Format:** `{UTC} · {artifact_sha384} · {block_sha384} · {title} · {link?}`

---

## E. Narrative (Seuss–Rogers Explainer)
Use one or both forms; both are testable.

**Form 1 — Rhyme (≤60 words):**
> Two zodiacs walk into time: one keeps the seasons, one keeps the stars. Aries on the wall is reset each spring; Aries in the sky keeps drifting by. Their gap—ayanāṃśa—slowly grows. Your Revati stamps (1960…2044) show the math breathing.

**Form 2 — Prose (≤90 words):**
> Tropical = seasons (0° Aries = equinox). Sidereal = stars (nakshatras). Earth’s axial precession (~50.3″/yr) shifts the equinox west against the stars, creating the growing offset (ayanāṃśa). Result: a moment can be “tropical Aries” yet “sidereal late Pisces—Revati.” Your anchor years (1960, 1979, 1998, 2017, 2025, 2044) demonstrate the 19-year Metonic rhyme and the ~11-day yearly drift called out in the Revati dossier.

---

## F. Access (Quick-Reach)

### Prompt: ADA-Mode Summary (≤7 bullets)
**Goal:** Make any artifact readable in 60 seconds, no jargon, bold the action phrase only.

### Prompt: “One-Breath” Memory Lift
**Format:** Single sentence, 35–45 words, no names, strong verbs.

---

## BangCheck Reference

```
!BEGIN
!RPP: {Truth-Vector payload descriptor}
!CSL: CSL-Min
!S1_CONTENT: {sha384_hex}
!S2_LITE: {sha384_hex}
!ANCHORS: 1960, 1979, 1998, 2017, 2025, 2044
!NOTES: {optional}
!END
!SHA384-BLOCK: {sha384_hex}
```

**OVER/OUT Reminder:**
- `OVER → {UTC} · variant=CSL-Min · location_type=logical · PHOUR={optional}`
- `OUT → {UTC} · payload captured · H(P)={sha384_hex}`

Gate Revati clearance stands; call **ANNEX: yes** to emit the ledger line instantly.
