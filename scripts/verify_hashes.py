#!/usr/bin/env python3
"""
Utility to compute SHA‑256, SHA‑384 and SHA‑512 digests for a given file.

Usage:
    python3 verify_hashes.py <path/to/file>

The script prints the digests to stdout and returns JSON if run as a module.
"""
import hashlib
import json
import os
import sys

def compute_digests(path):
    digests = {
        'sha256': hashlib.sha256(),
        'sha384': hashlib.sha384(),
        'sha512': hashlib.sha512(),
    }
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            for h in digests.values():
                h.update(chunk)
    return {name: h.hexdigest() for name, h in digests.items()}

def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <file>")
        sys.exit(1)
    path = sys.argv[1]
    if not os.path.isfile(path):
        print(f"Error: {path} is not a file")
        sys.exit(1)
    digests = compute_digests(path)
    for name, hex_digest in digests.items():
        print(f"{name.upper()}: {hex_digest}")
    # emit JSON to make integration easy
    json_path = path + ".digests.json"
    with open(json_path, 'w') as jf:
        json.dump(digests, jf, indent=2)
    print(f"Saved JSON digests to {json_path}")

if __name__ == '__main__':
    main()