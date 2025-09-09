# CSP-RK (Nodian) Supplement

**Primary Artifact:** `csp.tex`  
**Artifact SHA-384:** `2cf10062d2416885dc784abd3d80bc24aa0381623cca20b90c768e1c1fbabef5c5650b911f71415c11e1b709ff39bc95`

This supplement adds the **CSP-RK** (Rahu/Ketu nodal) variant to the existing CSL-Min seal.  
Ephemeris values are placeholders to be filled via offline computation (Swiss Ephemeris/JPL).

## Seal JSON (csp-rk)
```json
{
  "celestial":{
    "ketulon_deg":null,
    "moon_lon_deg":null,
    "rahulon_deg":null,
    "sol_phase":null,
    "sun_lon_deg":null,
    "tidal_index":null
  },
  "csl":{
    "artifact_sha384":"2cf10062d2416885dc784abd3d80bc24aa0381623cca20b90c768e1c1fbabef5c5650b911f71415c11e1b709ff39bc95",
    "dur_ms":0,
    "location":{
      "label":"chat.session",
      "type":"logical"
    },
    "t_in":"2025-09-09T00:49:08Z",
    "t_out":"2025-09-09T00:49:08Z",
    "variant":"csl-min",
    "version":"csp-0.3"
  },
  "s2_lite_sha384":"b0a836164a1adb6e2796bce85c08fde682c455c35cb20888c82f9f57ab3e4d4d820042a73d4e10038e06b4b146959523",
  "variant":"csp-rk",
  "version":"csp-0.3"
}
```

## BangCheck (RK Patch)
```
!BEGIN CSP_RK_PATCH
!RPP csp.tex → CSP-RK supplement
!CSL t_in=2025-09-09T00:49:08Z t_out=2025-09-09T00:49:08Z dur_ms=0 loc=logical:chat.session
!S1_CONTENT sha384=2cf10062d2416885dc784abd3d80bc24aa0381623cca20b90c768e1c1fbabef5c5650b911f71415c11e1b709ff39bc95
!S2_LITE sha384=b0a836164a1adb6e2796bce85c08fde682c455c35cb20888c82f9f57ab3e4d4d820042a73d4e10038e06b4b146959523
!ANCHORS variant=CSP-RK; version=csp-0.3
!NOTES Nodian (Rahu/Ketu) fields present; ephemerides pending offline fill.
!END CSP_RK_PATCH
5f8da4825889552708074e5d8472fac67f65ca8fa270dd595ca814d1545de7fae5d3a6bfeb0617fd6531ed5fd9a568b3

```
