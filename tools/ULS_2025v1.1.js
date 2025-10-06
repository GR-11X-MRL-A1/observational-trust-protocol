/*
 * ULS 2025 v1.1 — Scriptable custodial receipt aligned with CSP 1.5.0.
 *
 * This Scriptable script:
 *   1. Prompts for an artifact file.
 *   2. Computes S₁ = SHA-384(artifact bytes).
 *   3. Builds a CSL-Min record with deterministic canonical JSON.
 *   4. Computes S₂ = SHA-384( canonical_json || raw_bytes(S₁) ).
 *   5. Emits a BangCheck block whose terminal digest covers the full block.
 *   6. Saves the receipt to iCloud Drive (~/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/ULS_Receipts).
 *
 * The anchor stub uses the published Sun+Jupiter quantisation from the CSP 1.5.0 white paper
 * so that auditors can cross-check against the example vectors.
 */

async function main() {
  const artifactPath = await DocumentPicker.openFile();
  if (!artifactPath) {
    console.warn("No artifact selected.");
    return;
  }

  const tIn = new Date();
  const artifactData = Data.fromFile(artifactPath);
  const s1Data = await Crypto.digest("SHA-384", artifactData);
  const tOut = new Date();

  const s1Hex = dataToHex(s1Data);

  const deltaSeconds = Math.max(0, Math.round((tOut.getTime() - tIn.getTime()) / 1000));
  const deltaLiteral = `${deltaSeconds}s`;

  const anchorSerialized = "Jupiter:1768244:328:5173488,Sun:4115557:21673:6659";
  const anchorHash = await sha384HexOfString(anchorSerialized);

  const cslContext = {
    "variant": "CSL-Min",
    "t_in": tIn.toISOString(),
    "t_out": tOut.toISOString(),
    "Δt": deltaLiteral,
    "location_type": "logical",
    "anchor": {
      "frame": "ECLIPJ2000",
      "bodies": ["Jupiter", "Sun"],
      "serialized": anchorSerialized,
      "hash": anchorHash
    }
  };

  const canonicalJson = canonicalizeJson(cslContext);
  const canonicalData = Data.fromString(canonicalJson, "utf-8");
  const combinedRaw = canonicalData.toRawString() + s1Data.toRawString();
  const combinedData = Data.fromRawString(combinedRaw);
  const s2Data = await Crypto.digest("SHA-384", combinedData);
  const s2Hex = dataToHex(s2Data);

  const bangBlock = await buildBangCheck({
    artifactPath,
    cslContext,
    s1Hex,
    s2Hex,
    anchorSerialized,
    anchorHash
  });

  await saveReceipt(artifactPath, bangBlock, canonicalJson, s1Hex, s2Hex);

  await QuickLook.present(bangBlock);
  console.log("S1:", s1Hex);
  console.log("S2:", s2Hex);
}

function canonicalizeJson(value) {
  if (value === null) {
    return "null";
  }
  const type = typeof value;
  if (type === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("Non-finite numbers are not permitted in canonical JSON");
    }
    return JSON.stringify(value);
  }
  if (type === "boolean") {
    return value ? "true" : "false";
  }
  if (type === "string") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    const items = value.map(item => canonicalizeJson(item));
    return `[${items.join(",")}]`;
  }
  if (type === "object") {
    const keys = Object.keys(value).sort();
    const pairs = keys.map(key => `${JSON.stringify(key)}:${canonicalizeJson(value[key])}`);
    return `{${pairs.join(",")}}`;
  }
  throw new Error(`Unsupported value type: ${type}`);
}

function dataToHex(data) {
  const raw = data.toRawString();
  let hex = "";
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i) & 0xff;
    hex += code.toString(16).padStart(2, "0");
  }
  return hex;
}

async function sha384HexOfString(text) {
  const digest = await Crypto.digest("SHA-384", Data.fromString(text, "utf-8"));
  return dataToHex(digest);
}

async function buildBangCheck({ artifactPath, cslContext, s1Hex, s2Hex, anchorSerialized, anchorHash }) {
  const fileName = artifactPath.split("/").pop();
  const title = `ULS Custodial Receipt (${fileName})`;
  const cslLine = `!CSL variant=${cslContext.variant} t_in=${cslContext.t_in} t_out=${cslContext.t_out} Δt=${cslContext["Δt"]} anchor.hash=${anchorHash}`;
  const lines = [
    `!BEGIN ${title}`,
    `!RPP sha384=PENDING`,
    cslLine,
    `!S1_CONTENT sha384=${s1Hex}`,
    `!S2_LITE sha384=${s2Hex}`,
    `!ANCHORS ${anchorSerialized}`,
    `!NOTES Deterministic, offline-verifiable; canonical JSON; LF newlines`,
    `!END`
  ];
  const blockWithoutDigest = lines.join("\n") + "\n";
  return await appendBangCheckDigest(blockWithoutDigest);
}

async function appendBangCheckDigest(blockWithoutDigest) {
  const digest = await computeTextSha384(blockWithoutDigest);
  const updated = blockWithoutDigest.replace("!RPP sha384=PENDING", `!RPP sha384=${digest}`);
  return `${updated}!SHA384-BLOCK ${digest}\n`;
}

async function computeTextSha384(text) {
  const data = Data.fromString(text, "utf-8");
  const digest = await Crypto.digest("SHA-384", data);
  return dataToHex(digest);
}

async function saveReceipt(artifactPath, bangBlock, canonicalJson, s1Hex, s2Hex) {
  const fm = FileManager.iCloud();
  const receiptsDir = fm.joinPath(fm.documentsDirectory(), "ULS_Receipts");
  if (!fm.fileExists(receiptsDir)) {
    fm.createDirectory(receiptsDir, true);
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const baseName = `${timestamp}`;
  const receiptPath = fm.joinPath(receiptsDir, `${baseName}.txt`);
  const cslPath = fm.joinPath(receiptsDir, `${baseName}.csl.json`);
  const manifestPath = fm.joinPath(receiptsDir, `${baseName}.manifest.json`);

  fm.writeString(receiptPath, bangBlock);
  fm.writeString(cslPath, canonicalJson + "\n");
  const manifest = {
    artifact: artifactPath.split("/").pop(),
    saved_at: new Date().toISOString(),
    s1: s1Hex,
    s2: s2Hex
  };
  fm.writeString(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

main().catch(err => {
  console.error("ULS 2025 v1.1 failed:", err);
});
