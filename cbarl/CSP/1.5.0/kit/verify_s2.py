#!/usr/bin/env python3
"""Minimal S₂ verifier for CSP 1.5.0.

Usage:
    python3 verify_s2.py --csl path/to/csl.json --s1 <sha384-of-artifact>

The script follows the white paper exactly:
1. Load the CSL JSON file (UTF-8).
2. Canonicalise with RFC 8785 semantics (sorted keys, `,` and `:` separators).
3. Append the raw bytes of S₁ (the SHA-384 digest of the artifact).
4. Emit the SHA-384 hex digest of the concatenated bytes.
"""

import argparse
import json
import hashlib
from pathlib import Path


def canonical_json_bytes(obj: object) -> bytes:
    """Return RFC 8785 canonical JSON encoding for `obj` (UTF-8)."""
    return json.dumps(obj, separators=(",", ":"), sort_keys=True).encode("utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="CSP 1.5.0 S₂ verifier")
    parser.add_argument(
        "--csl",
        required=True,
        type=Path,
        help="Path to canonical CSL JSON",
    )
    parser.add_argument(
        "--s1",
        required=True,
        help="SHA-384 digest (hex) of the artifact payload",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    with args.csl.open("r", encoding="utf-8") as handle:
        csl_obj = json.load(handle)

    canonical_bytes = canonical_json_bytes(csl_obj)

    try:
        s1_bytes = bytes.fromhex(args.s1)
    except ValueError as exc:
        raise SystemExit(f"Invalid S1 hex digest: {exc}") from exc

    digest = hashlib.sha384(canonical_bytes + s1_bytes).hexdigest()
    print(digest)


if __name__ == "__main__":
    main()
