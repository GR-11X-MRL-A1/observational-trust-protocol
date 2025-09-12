# Examples

## Layout
examples/
  artifacts/
    002_画板 1.jpg
  sidecars/
    vector-minimal.json

## Verify
pip install --upgrade pip
python3 tools/verify.py --artifact examples/artifacts/002_画板\ 1.jpg --sidecar vectors/vector-minimal.json
# Expected: VALID_MINIMAL
