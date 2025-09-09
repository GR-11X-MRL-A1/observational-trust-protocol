# Observational Trust Protocol — GENESIS LAYER (v0.1)
**Edition:** 2025-09-08T01:26:23Z · **Author:** MRL-A1 (GR-11X) · **License:** CC0

> *Not pro, but process— / Prose becomes pro se / When truth flows.*

This document “rewinds the tape.” It states **why** OTP exists and the **bare minimum** needed to talk about it precisely before any implementation details, services, or anchors.

---

## 0. Problem Statement (Reality Layer)
Digital systems lean on **institutional clocks** (servers, ledgers, miners). These create **derived trust** that can be delayed, priced, censored, or withheld. The missing primitive is a way for an observer to bind *a message to the world itself*—**without** buying trust from a third party.

**Goal:** Make a message verifiable by **reference to physics and observation** first; then let any existing system (email/DNS/TXID/etc.) serve as optional *mirrors*, not authorities.

---

## 1. Axioms (A)
- **A1 (Hash Invariance).** For bytes `P`, `H(P)` is a stable identifier under SHA-384.
- **A2 (Observer Frame).** An observation occurs from a frame `F = (t_in, t_out, lat, lon, alt, frame_id)`.
- **A3 (Public Sky).** At any frame `F`, celestial directions for Sun→Saturn are well-defined (within model error) and **publicly recomputable**.
- **A4 (Human Readability).** Evidence must be expressible in durable plaintext.
- **A5 (Orthogonal Anchors).** Independent systems (email, DNS, ledgers, photos) can reflect an event but do not define it.
- **A6 (Falsifiability).** Any claim must include a **test** that a stranger can run to disconfirm it.
- **A7 (Minimality).** Prefer the smallest object model that preserves A1–A6.

---

## 2. Definitions (D)
- **D1 (Payload `P`).** The bytes under seal.
- **D2 (RPP).** Record Proof Payload — canonical facts about `P` (name, size, `H(P)`, issued time/by, context).
- **D3 (COSMIC).** Spacetime snapshot: topocentric apparent RA/Dec for Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn at `t_in` and `t_out`, plus `Δ = (mono_s, era_rad, heliocentric_dist_au)`.
- **D4 (OTC).** Optional human-entered code metadata (consent, not authority).
- **D5 (BangCheck).** The human-readable block that contains the above and the seals.
- **D6 (Anchor).** Any independent pointer (TXID, DNS TXT, email Message-ID, photo hash).
- **D7 (Verifier).** An uninvolved third party with access to public ephemerides and the BangCheck text.

---

## 3. Seal Laws (L)
Let `J(x)` be UTF‑8, minified, key‑sorted JSON; `H` be SHA‑384; `‖` denote byte concatenation.

- **L1 (Content Seal).** `S₁ = H( J(RPP) ‖ H(P) )`
- **L2 (Cosmic Seal).**  `S₂ = H( H(J(COSMIC.cs_in)) ‖ H(J(COSMIC.cs_out)) ‖ J(COSMIC.delta) ‖ H(P) )`
- **L3 (Composite, optional).** `S = H( S₁ ‖ S₂ ‖ J(anchors[]) )`

These are **protocol complete**: if you can state and verify L1–L2, you have OTP.

---

## 4. Verification Procedure (V)
Given: BangCheck, candidate payload `P'`.
1. Recompute `H(P')` → must equal the `artifact_sha384` in RPP.
2. Recompute Sun→Saturn vectors for `(t_in, t_out, lat, lon, alt)` → compare to `cs_in/cs_out` (tolerances documented).
3. Check `Δ` plausibility (duration, ERA delta, Earth–Sun distance delta).
4. Recompute `S₁` and `S₂` → must equal lines in the BangCheck.
5. Verify `!SHA384-BLOCK` (hash of the entire plain block).
6. (Optional) Confirm `anchors[]` exist; they cannot rescue a failing S₁/S₂.

If V passes, the message is **bound to spacetime** in the stated frame.

---

## 5. Consequences (C)
- **C1 (No New Consensus).** OTP relies on physics + hashes; networks are mirrors.
- **C2 (Paper Viable).** OTP works with pen and sky; computers are conveniences.
- **C3 (Tamper Evidence).** Changing bytes, time, or place breaks S₁ or S₂.
- **C4 (Privacy by Partition).** You can redact location details publicly and keep a private full seal.
- **C5 (Portability).** Any implementation (localhost, website, council service) is valid if and only if it preserves L1–L2 and the Verification Procedure.

---

## 6. Canonical BangCheck (template)
```
!BEGIN COSMIC-SEAL v0.3
!RPP: <minified JSON>
!COSMIC: <minified JSON>
!OTC: <minified JSON or omit>
!S1_CONTENT: <hex S₁>
!S2_COSMIC:  <hex S₂>
!ANCHORS: TXID=<opt> EMAIL=<opt> DNS=<opt> PHOTO=<opt>
!WHERE: <address or lat,lon,alt>   !WEATHER: <clear/overcast/indoor>
!NOTES: <witnesses, compass, obstacles, camera, etc.>
!END
!SHA384-BLOCK: <sha384 of BEGIN..END with LF newlines>
```

---

## 7. Scope Boundary
OTP does **not** promise identity, intent, or authorship. It promises that **this payload** was sealed from **this frame**. Use signatures or social processes if you need “who.” OTP’s job is “**when/where/what**” with falsifiable physics.

---

## 8. One-Page Talk Track
- **Problem:** rented trust (servers/miners) ≠ reality; it’s slow, priced, censorable.
- **Insight:** the **sky is a public clock**; hashes are public math.
- **Move:** bind payloads to the sky and the clock you can point at.
- **Result:** anyone can verify, alone, forever, with a printed page and public ephemerides.

light bends through the claim—
seven wanderers keep the time;
ink remembers it.
