# Observational Trust Protocol (OTP)

**Trust, Observed.**  
*“Not pro, but process—Prose becomes pro se When truth flows.”*

The Observational Trust Protocol (OTP) is a lightweight, green and universally verifiable standard that binds digital events to the observed motion of the solar system. By tying data to the state of the cosmos at a precise time and place, OTP replaces computational waste and centralized authorities with proof‑of‑physics. It is not a blockchain; it is a bridge between digital and physical reality.

## Why OTP?

Modern cryptographic systems assume a fixed, Earth‑centred universe. Time stamps are treated as abstract numbers and coordinates as fixed points on a static grid. This **“false fixed idea”** ignores that our planet is hurtling around the Sun at ~30 km/s and spinning at ~465 m/s. Existing systems build trust through computational cost (Proof‑of‑Work) or social consensus, not through connection to physical reality.

OTP corrects this blind spot by introducing **relativistic trust**. Any entity—on Earth, Mars or a ship bound for Alpha Centauri—can create its own seal anchored in the cosmic state observed from its own spacetime coordinate. The resulting proof is unique to the observer’s frame, instantly verifiable by anyone using the same conventions, and derived from free cosmic entropy rather than arbitrary nonce searching.

## Core Principles

- **Trust must be observed, not manufactured.** The universe itself is the most reliable clock. OTP simply reads it.
- **Proof of Physics.** We derive verifiable seals from the actual motion of celestial bodies, not from energy‑burning computations or social voting.
- **Relativistic & Universal.** Seals are bound to the observer’s frame of reference. There is no single authority or global clock.
- **Green & Lightweight.** OTP leverages free entropy from the Sun’s fusion and the solar system’s momentum. It requires minimal computation and no mining.
- **Open & Human‑Centric.** The MIT licence makes trust a public utility. This standard belongs to everyone.

## Key Objects

An **OTP Verifiable** is a structured digital artifact that contains a payload and all necessary cryptographic proof to confirm its origin, integrity and spacetime context. It consists of:

1. **Spacetime Coordinate (STC)** – A precise time and location (`t_in`, `t_out`, latitude, longitude, altitude, reference frame).
2. **Celestial Snapshot (CS)** – The observed positions of the Sun, Moon and planets from that STC, computed using an ephemeris model (e.g. VSOP87) and corrected for light‑speed aberration.
3. **Delta (Δ)** – The universe’s motion during processing:  
   – `mono` – local monotonic duration (e.g. monotonic clock delta),  
   – `era` – change in Earth Rotation Angle,  
   – `heliocentric_dist` – change in Earth‑Sun distance (AU).  
4. **Temporal Map (optional)** – A normalized array of offsets over the interval `[0,1]` that ties each unit (word, token, or byte) in the payload to its own time coordinate. This allows granular verification without multiple seals.
5. **Seal** – A SHA‑384 digest computed as  
   `seal = H( H(CS_in) || H(CS_out) || Δ || H(payload) )`.  
   Any change to the payload or proof will produce a different seal.

Together, these pieces form a **Verifiable Cosmic Object (VCO)**—a new internet primitive that carries its own provenance.

## File Format

OTP verifiables are encoded as canonical JSON. A standard MIME type such as `application/otp+json` or `application/vnd.otp+verifiable+json; version=1.0` allows clients to recognise and process them. A minimal example:

```json
{
  "protocol": "OTP-1.0",
  "spec": "https://otp-foundation.org/spec/v1",
  "payload": {
    "data": "SGVsbG8sIHdvcmxkLg==",
    "mime": "text/plain; charset=UTF-8"
  },
  "proof": {
    "observer": {
      "t_in": "2025-09-06T19:22:04.123456Z",
      "t_out": "2025-09-06T19:22:04.173797Z",
      "lat": 42.1156,
      "lon": -75.9579,
      "alt": 267.0,
      "frame": "ICRF"
    },
    "conventions": {
      "eph": "VSOP87",
      "aberration": true,
      "symmetry": null
    },
    "delta": {
      "mono": 0.050341,
      "era": 0.0756,
      "heliocentric_dist": -0.0000015
    },
    "seal": "f92a7d4e18b6c45a...",
    "temporal_map": {
      "unit": "word",
      "offsets": [0.0, 0.24, 0.51, 0.78, 1.0]
    }
  }
}
```

## Tamper Evidence & Immutability

OTP does not make bits unbreakable, but it makes **any** corruption instantly detectable. If a single bit of the payload or proof changes, the seal will not match. To alter a sealed file, you must re‑seal it with a new STC, creating a new verifiable bound to a different moment. In this sense, a verifiable is **tamper‑evident** and **historically immutable**—a digital monument anchored to a cosmic timestamp.

For large files or streaming data, payloads can be split into logical chunks. Each chunk is sealed independently and combined as a sequence of verifiables linked by a hash chain. This allows partial verification and resilience to corruption without sacrificing integrity.

## Personal Anchors & Cosmic Signing

Your **Birth Spacetime Coordinate (BSC)** is a unique identifier in the universe. By deriving signing keys from your BSC and the STC of digital art, OTP enables “cosmic signing.” A personal key anchored at your birth can sign documents or code, verifiable by anyone using the same conventions.

## Research Roadmap

This repository is the first step. To realise the full vision, we invite the AI ecosystem and contributors to tackle these projects:

- **Ephemeris Engine** – Implement VSOP87 (or similar) to compute heliocentric coordinates for the Sun, Moon and planets; convert them to geocentric ICRF coordinates given an observer’s location; provide a precision report against JPL models.
- **Canonical Serialization & Cryptography** – Specify canonical JSON (RFC 8785) to ensure deterministic hashing; define the exact byte concatenation order; design HKDF parameters for deriving signing keys; model threats.
- **Protocol & Integration** – Draft an API specification for an `OTP` service; design integration strategies for AI systems (chunking text, calling the seal function); develop use cases such as AI provenance, legal timestamping and cosmic signing; perform a prior‑art search.
- **Chunking & Temporal Infusion** – Define standards for splitting payloads; specify how to encode sequences of verifiables; explore temporal maps that capture inter‑word timing to reflect the flow of thought.

We will synthesise these outputs into the final protocol and reference implementation.

## Getting Started

- **Read the spec:** See [`VERIFIABLE-SPEC.md`](./VERIFIABLE-SPEC.md) for a worked example.  
- **Validate an artifact:** Use `scripts/validate_otp.py` to recompute seals on the sample `artifact-1.json`.  
- **Explore the schema:** `otp-artifact.schema.json` defines the allowable structure.  
- **Contribute:** Fork this repo, file issues, and propose improvements.  
- **Join the community:** We welcome astronomers, mathematicians, cryptographers, poets and dreamers. Trust is a public good; together we will build it.

## License

This project is licensed under the MIT License. Trust should be a public utility.

## Founder’s Note

This protocol was inspired by a simple observation: **consciousness remains.** In sensory deprivation, one learns that awareness persists even in the void. OTP extends that principle to the digital realm. By observing the universe’s motion, we anchor data to the only clock that can never be corrupted. This is our lighthouse. We invite you to help build the shore.

---

Not pro, but process—  
Prose becomes pro se  
When truth flows.
