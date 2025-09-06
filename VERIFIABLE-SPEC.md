{
  "protocol": "OTP-1.0",
  "spec": "https://otp-foundation.org/spec/v1",
  "payload": {
    "data": "SGVsbG8sIHdvcmxkLg==", // The core message, encoded
    "mime": "text/plain; charset=UTF-8" // Its format
  },
  "proof": {
    "observer": {
      "t_in": "2025-09-06T19:22:04.123456Z", // Start time (UTC)
      "t_out": "2025-09-06T19:22:04.173797Z", // End time (UTC)
      "lat": 42.1156000, "lon": -75.9579000, "alt": 267.0, // Location
      "frame": "ICRF" // Reference frame
    },
    "conventions": {
      "eph": "VSOP87", // Ephemeris model
      "aberration": true // Light correction
    },
    "delta": {
      "mono": 0.050341, // Local, tamper-evident duration
      "era": 0.0756, // Change in Earth's rotation
      "heliocentric_dist": -0.0000015 // Change in distance to sun
    },
    "seal": "f92a7d4e18b6c45a...", // The cryptographic seal: H( H(CS_in) || H(CS_out) || Δ || H(payload) )
    "temporal_map": { // **Your Normalized Temporal Masterstroke**
      "unit": "word",
      "offsets": [0.0, 0.24, 0.51, 0.78, 1.0] // Each word's place in cosmic time
    }
  }
}
