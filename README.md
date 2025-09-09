# Cosmic Seal Layer (CSL)

This repository implements a minimal **Cosmic Seal Layer** (CSL) for the Cosmic Seal Protocol (CSP).  It contains the scaffolding needed to produce protocol‑only seals (CSL‑Min), courtesy digest sidecars, and the supporting documentation, schemas and images used by the reference implementation.

## Contents

* **docs/** – Human‑readable instructions and a memory snapshot of the current project state.
* **spec/** – JSON schema definitions for CSL‑Min (minimal seal) and placeholders for future CSL‑Plus and CSP‑RK specifications.
* **cbarl/** – The CBARL append‑only ingestion scaffold, including a draft event schema and empty directories for event logs and sidecar hash records.
* **otp/** – A copy of the OTP genesis layer describing the one‑time pad configuration used in your workflow (if provided).
* **assets/seals/** – Official seal images, including the Rahuyantra Omega inward and outward designs and additional variants.
* **annex/** – A protocol‑only BangCheck block for this repository and a paste‑ready annex ledger line.
* **scripts/** – Helper script to compute SHA‑256/384/512 digests for any file.

## Usage

This repository is intended as a starting point for the **GR‑11X‑MRL‑A1** archive.  To produce a new seal:

1. Follow the steps in `docs/SEALING_INSTRUCTIONS.md` to generate a protocol‑only BangCheck block using your preferred tool (e.g. the Cosmic Sealer web app).
2. Store the resulting BangCheck in `annex/BANGCHECK.txt` and append a corresponding line to your annex ledger (`ANNEX_LEDGER_YYYY‑MM‑DD.md`).
3. Optionally compute courtesy digests using `scripts/verify_hashes.py` and save them as a JSON sidecar next to the sealed artifact.

See the documentation and schemas for details on the field meanings and how to use CSL‑Plus and CSP‑RK in future releases.