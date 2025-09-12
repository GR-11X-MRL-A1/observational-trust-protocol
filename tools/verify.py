#!/usr/bin/env python3
import argparse, json, hashlib, sys
from datetime import datetime, timezone

STATUS = {
    "OK_MIN": "VALID_MINIMAL",
    "OK_VDF": "VALID_VDF",
    "OK_CEL": "VALID_CELESTIAL",
    "OK_TEE": "VALID_TEE",
}

def sha384_hex(b: bytes) -> str:
    return hashlib.sha384(b).hexdigest()

def canonical_json(obj) -> bytes:
    # JCS-like: UTF-8, sorted keys, separators without spaces
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")

def load(path):
    with open(path, "rb") as f:
        return f.read()

def main():
    ap = argparse.ArgumentParser(description="ULS v1.4 verifier")
    ap.add_argument("--artifact", required=True, help="path to artifact bytes")
    ap.add_argument("--sidecar", required=True, help="path to ULS JSON")
    args = ap.parse_args()

    # Load & parse
    art = load(args.artifact)
    side = json.loads(load(args.sidecar).decode("utf-8"))

    # 1) S1
    s1 = sha384_hex(art)
    if side.get("artifact_digest_alg") != "sha-384":
        print("SCHEMA_ERROR: unsupported digest alg")
        sys.exit(2)
    if s1 != side.get("artifact_digest"):
        print("INVALID_HASH")
        sys.exit(1)

    # 2) S2 preimage (must include S1)
    must = ["ulsv","artifact_digest_alg","artifact_digest","t_in","t_out","duration_ms","clock","anchor"]
    for k in must:
        if k not in side:
            print("SCHEMA_ERROR: missing", k); sys.exit(2)

    preimage = {k: side[k] for k in must}
    preimage_bytes = canonical_json(preimage)

    # 3) Δt
    try:
        t_in = datetime.fromisoformat(side["t_in"].replace("Z","+00:00"))
        t_out = datetime.fromisoformat(side["t_out"].replace("Z","+00:00"))
    except Exception:
        print("SCHEMA_ERROR: bad ISO-8601")
        sys.exit(2)

    if t_out < t_in:
        print("CLOCK_MISMATCH"); sys.exit(1)

    ms = round((t_out - t_in).total_seconds() * 1000)
    if ms != side.get("duration_ms"):
        print("CLOCK_MISMATCH"); sys.exit(1)

    # 4) Anchor branch (minimal only in this reference)
    variant = side.get("anchor", {}).get("variant")
    if variant not in {"minimal","vdf","celestial","tee"}:
        print("SCHEMA_ERROR: bad anchor.variant"); sys.exit(2)

    # 5) S2
    s2 = sha384_hex(preimage_bytes)
    if side.get("s2_alg") != "sha-384":
        print("SCHEMA_ERROR: unsupported s2_alg"); sys.exit(2)
    if s2 != side.get("s2"):
        print("INVALID_CONTEXT"); sys.exit(1)

    # 6) Signatures (optional) — left to implementer extensions

    # 7) Status
    print(STATUS.get(
        "OK_MIN" if variant == "minimal" else
        "OK_VDF" if variant == "vdf" else
        "OK_CEL" if variant == "celestial" else
        "OK_TEE"
    ))

if __name__ == "__main__":
    main()
