# Hash Verification Guide

This guide explains how to use the `scripts/verify_hashes.py` helper to compute
and persist courtesy digests for artifacts that you seal with the Cosmic Seal
Layer (CSL).

## Prerequisites

* Python 3.8 or newer.
* Read access to the artifact you want to verify.

## Basic Usage

Run the script with the path to the artifact:

```bash
python3 scripts/verify_hashes.py /path/to/artifact.bin
```

The command prints SHA-256, SHA-384, and SHA-512 digests to the terminal and
writes a JSON sidecar next to the source file (for example,
`artifact.bin.digests.json`).

## Automating Courtesy Digests

You can call the module from another Python tool to integrate digest creation
into your sealing workflow:

```python
from scripts.verify_hashes import compute_digests

with open("artifact.bin", "rb") as fh:
    # compute_digests expects a filesystem path; adjust as needed if you stage
    # artifacts in a temporary location first.
    digests = compute_digests("artifact.bin")
    print(digests)
```

Persist the resulting dictionary to your preferred storage medium or reuse the
CLI JSON file for annex submissions.

## Suggested Checklist

1. Generate or receive the artifact you plan to seal.
2. Run `verify_hashes.py` and confirm the printed digests.
3. Attach the JSON sidecar to your annex ledger entry or storage medium.
4. Include the digests in your BangCheck block when courtesy hashes are
   required.

Following this checklist ensures downstream verifiers can reproduce the courtesy
hashes without recalculating them manually.
