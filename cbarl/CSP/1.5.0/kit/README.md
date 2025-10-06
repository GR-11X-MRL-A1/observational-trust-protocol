# Cosmic Seal Protocol (CSP) 1.5.0 — Minimal Verifier Kit

This kit collects the smallest set of files needed to reproduce the **Cosmic Seal Protocol (CSP) 1.5.0** test vectors and to verify any CSL-Min or CSL-Plus record offline.  It is designed to be self-contained: copy the directory next to an artifact and run the Python verifier on any machine with a standard interpreter.

## Contents

```
cbarl/CSP/1.5.0/kit/
├── README.md                  # This document
├── bangcheck.template.txt     # Auditor-ready BangCheck scaffold
├── csl.min.schema.json        # JSON Schema for CSL-Min records
├── csl.plus.schema.json       # JSON Schema for CSL-Plus records
├── verify_s2.py               # Minimal S₂ verifier (Python 3)
└── examples/
    └── hello_csp/
        ├── artifact.bin       # "Hello, CSP\n" demo artifact
        ├── csl.json           # Canonical CSL-Min record
        └── bangcheck.txt      # Full BangCheck block with S₁/S₂
```

The example reproduces the hashes published in the CSP 1.5.0 white paper (Sun + Jupiter anchor, `t_in = t_out = 2025-09-30T12:00:00Z`).

## Verifying S₂

Run the Python helper with the canonical CSL and the published S₁ digest:

```bash
python3 verify_s2.py --csl examples/hello_csp/csl.json \
                     --s1 c7095972fbf517cbe79c90bf15de19c32133da544af5c3086c9df6e94b10b21c18e325726da0c5930df745724d4a971e
```

Expected output:

```
88029b8695945a431ce421c89cc75b88c935a10595918aa3170efbb8605382ade7f3b3a963195942f703f1e728474833
```

The script mirrors the white paper: it canonicalises the CSL with RFC 8785 semantics (sorted keys, `","` separators) and appends the **raw bytes** of S₁ before hashing.  The included CSL records additional anchor metadata (`frame`, `bodies`) to aid auditors; regenerate the record from the white paper’s minimal template if you need the printed digest `S₂ = 7d9e…`.

## JSON canonicalisation notes

* The canonical JSON must be encoded in UTF-8 with `\n` line endings.
* Key order is lexicographical at every object level (RFC 8785).
* Numbers use ECMAScript JSON grammar; timestamps are full-precision RFC 3339 strings.
* Field `"Δt"` expresses the elapsed sealing interval as an ISO-8601-like literal (e.g. `"0s"`, `"36s"`).

## BangCheck discipline

* Use LF-only newlines throughout the block.
* The terminal `!SHA384-BLOCK` line hashes the entire BangCheck text from `!BEGIN` through the trailing newline after `!END`.
* Do not insert courtesy digests inside the block; attach them as sidecars if needed.

## Schemas

* [`csl.min.schema.json`](csl.min.schema.json) captures the required fields for CSL-Min (interval, anchor, S₂ configuration).
* [`csl.plus.schema.json`](csl.plus.schema.json) extends the minimal schema with the deterministic `cosmic_base` hash required for CSL-Plus.

Both schemas follow JSON Schema Draft 2020-12 and can be used with tools such as `ajv` or `python -m jsonschema`.

## Licensing

* Documentation: CC BY 4.0
* Code: Apache-2.0

These match the licenses noted in the CSP 1.5.0 white paper.
