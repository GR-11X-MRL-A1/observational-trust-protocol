# Universal Light Seal Protocol (ULS) — v1.4

## 1. Principle
All digital verification is contextual and relativistic. ULS binds:
- S1: a cryptographic digest over the artifact bytes, and
- S2: a canonical digest over a verifiable context snapshot (“anchor”),
such that the **ULS Block** is the atomic unit of trust.

## 2. Data Model (JSON; CBOR allowed)
- Required fields: `ulsv, artifact_digest_alg, artifact_digest, t_in, t_out,
  duration_ms, clock, anchor, s2_alg, s2`.
- `anchor.variant ∈ {minimal, vdf, celestial, tee}` (no “none”).
- **S2 preimage MUST include S1**: `{ulsv, artifact_digest_alg, artifact_digest, t_in, t_out, duration_ms, clock, anchor}`.

## 3. Normative Requirements
1) S1 = HASH(artifact_bytes). RECOMMENDED: sha-384.  
2) Δt computed from monotonic clock; `duration_ms == round((t_out − t_in) × 1000)`.  
3) Anchors mandatory; variant rules in §5.  
4) Canonicalize S2 preimage per Annex A, then `s2 = HASH(bytes)`.  
5) Signatures optional; if present, specify `covered: S1|S2|BOTH` (RECOMMENDED BOTH).  
6) Unknown keys ignored except the must-understand set above.

## 4. Verification Algorithm
1. Recompute S1 and compare to `artifact_digest`.  
2. Parse JSON; validate required fields.  
3. Canonicalize S2 preimage (Annex A).  
4. Check Δt and timestamp ordering.  
5. Validate anchor per variant.  
6. Recompute S2 and compare.  
7. Verify signatures if present.  
8. Return status: `VALID_MINIMAL|VALID_VDF|VALID_CELESTIAL|VALID_TEE`
   or `INVALID_HASH|INVALID_CONTEXT|SIG_FAIL|SCHEMA_ERROR|CLOCK_MISMATCH|ANCHOR_MISMATCH`.

## 5. Anchors (richness spectrum)
- minimal: Δt self-consistency; disclosed clock properties.  
- vdf: verify proof & difficulty (Wesolowski or Pietrzak).  
- celestial: recompute sky state from `t_in` (DE440/TT) with rounding; compare.  
- tee: verify attestation; check monotonic counter.

## Annex A (Canonicalization)
- JSON: UTF-8; sorted keys; separators `,` and `:`; no extra whitespace.
- Numbers: integers; if floats used (celestial), encode with fixed precision defined in the block (e.g., `0.92000`, `134.500`).

## Annex B..E
- B: Celestial model (DE440/TT; rounding illum 5dp, angles 3dp)
- C: VDF profile (Wesolowski; modulus registry; domain separation)
- D: TEE profile (quote format; counter binding)
- E: VIS identity for anchor richness (badge system, spacing, reversal)

