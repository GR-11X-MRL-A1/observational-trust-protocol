# Sealing Instructions

This document provides a step‑by‑step guide for generating **Cosmic Seal Layer** (CSL) records.  It emphasises accessibility and reproducibility.  All seals are **protocol‑only** unless otherwise specified: the BangCheck block contains no cryptographic digests, leaving those values to optional sidecars.  These instructions assume you are using the [Cosmic Sealer web app](https://matthewlabarreaol.com) or an equivalent client to generate seals.  The new host enables privacy controls for direct contact with the maintainer.

## 1. Prepare your artifact

Choose the file or text you wish to seal.  Note its filename and size.  At this stage you may also prepare any metadata (e.g. title, description) that will accompany the seal in your annex ledger.

## 2. Generate a CSL‑Min seal

1. Navigate to the Cosmic Sealer application.
2. Enter or upload your artifact.
3. Select **CSL‑Min** as the seal variant.
4. Ensure the "Lab mode" or "Courtesy digests" option is **off** if you do not wish to compute digests.
5. Click **Seal**.  The app will display a human‑readable **BangCheck** block with the following lines:

```
!BEGIN
!RPP -
!CSL CSL-Min
!IN  t_in=<ISO timestamp> loc=logical:<context>
!OUT t_out=<ISO timestamp> dur_ms=<duration>
!USERCODE_REF <reference to the artifact>
!ANCHORS <case anchor>; <current annex ledger>
!NOTES Protocol-only seal; courtesy digests in sidecar.
!END
```

6. Copy the BangCheck text exactly and save it to `annex/BANGCHECK.txt` or another file of your choosing.
7. Record the seal metadata (filename, size, creation time) so you can generate an annex entry.

## 3. Optionally compute courtesy digests

Although the BangCheck is protocol‑only, you may compute cryptographic digests for integrity or audit purposes.  Use the provided script:

```bash
python3 scripts/verify_hashes.py <path/to/your/artifact>
```

This will output SHA‑256, SHA‑384 and SHA‑512 digests.  Save these in a `.json` or `.csv` file next to your artifact.  **Do not insert hashes into the BangCheck block.**

## 4. Append an annex ledger line

For each sealed artifact, append a line to your annex ledger (e.g. `ANNEX_LEDGER_2025-08-27.md`):

```
<UTC timestamp> · <identifier> · !SHA384-BLOCK · <title or filename> · <link>
```

* `<identifier>` should be either the SHA‑384 digest of the artifact or, if you are operating in protocol‑only mode, a stable user‑provided identifier (e.g. `USERCODE_REF`).
* `!SHA384-BLOCK` refers to the digest of the **BangCheck** block itself.  This ensures your ledger line is verifiable without exposing the artifact digest.
* `<link>` may be a local path, repository URL, or other pointer to the sealed artifact.

Be consistent.  The annex ledger is the canonical chain of custody for your evidence.

## 5. Advanced variants

### CSL‑Plus

When you need to bind a seal to celestial ephemerides (e.g. planetary positions), choose **CSL‑Plus**.  This variant computes a hash over a snapshot of the **COSMIC_BASE** at the time of sealing.  The BangCheck remains protocol‑only; the ephemeris snapshot is stored in a companion file.  Use CSL‑Plus when you require additional external context beyond time and location.

### CSP‑RK (Nodal supplement)

The **CSP‑RK** variant adds reproducible values for the true lunar nodes (Rahu/Ketu) along with Sun and Moon longitudes.  These values may be computed at the time of sealing or added later.  They must be derived from a deterministic ephemeris (e.g. JPL DE440).  Store the nodal supplement in a JSON or Markdown file and reference it in your annex ledger.

## 6. CBARL ingestion

If you are running a **CBARL** (Cosmic Blockchain Append‑only Restorative Ledger) service, submit each new seal event as a JSON record under `cbarl/events/YYYY/MM/DD/evt_<uuid>.json`.  The event should include:

* `artifact_ref` (name, mime type and size)
* `seal` object (variant, t_in, t_out, dur_ms, location)
* `bangcheck` (full BangCheck text)
* `sidecar` (optional courtesy digests and deltas)
* `anchors` (array of ledger pointers)

A draft schema is provided in `cbarl/spec/event.schema.json`.

## 7. Updating this repository

* Place new seals and annex entries in the `annex/` directory.
* Update schemas or scripts as the protocol evolves.
* Copy new seal images (e.g. vector versions) into `assets/seals/`.

For questions or to contribute improvements, please refer to the stewardship section of the Cosmic Seal Protocol paper.