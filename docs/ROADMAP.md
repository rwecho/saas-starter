# AI MIDI Workspace — Roadmap

## Phase 0 — Technical validation

Goal: prove that representative audio can produce useful MIDI before building the SaaS around it.

### Tasks

- [ ] Select browser transcription runtime and model adapter.
- [ ] Build a minimal transcription lab route.
- [ ] Decode MP3/WAV/M4A/FLAC locally.
- [ ] Run transcription off the main thread.
- [ ] Normalize model output into the project MIDI note model.
- [ ] Export a valid `.mid` file.
- [ ] Build a benchmark sample matrix.
- [ ] Record accuracy, timing, cleanup effort, and usefulness by source type.

### Exit criteria

- Representative solo piano, vocal/humming, guitar, and bass samples can generate usable MIDI.
- Dense full mixes are measured honestly rather than treated as equivalent to isolated instruments.
- The team knows which inputs should stay local and which require future stem separation.

---

## Phase 1 — Studio MVP

Goal: deliver a complete no-login Audio → MIDI user loop.

### Tasks

- [ ] Tool-first `/studio` UI.
- [ ] Drag/drop + file picker.
- [ ] File validation and duration display.
- [ ] Waveform rendering.
- [ ] Range selection.
- [ ] Transcription progress UI.
- [ ] Clean / Balanced / Detailed presets.
- [ ] Piano Roll renderer.
- [ ] Play/pause transport.
- [ ] Original audio preview.
- [ ] MIDI preview.
- [ ] Select/delete/move/resize notes.
- [ ] MIDI export.
- [ ] Product analytics events.
- [ ] Error and unsupported-browser states.

### Exit criteria

- Free flow requires no account.
- Free flow does not upload audio.
- Upload → Export rate can be measured.
- Core interaction remains responsive during model inference.

---

## Phase 2 — SaaS foundation

Goal: add identity, billing, credits, and operational foundations without damaging the free product loop.

### Tasks

- [ ] Generic billing schema.
- [ ] PayPal provider adapter.
- [ ] PayPal checkout and capture.
- [ ] Idempotent payment processing.
- [ ] Credit ledger.
- [ ] Account credits page.
- [ ] Billing/payment history.
- [ ] Authentication for paid/account features only.
- [ ] Privacy, Terms, Contact pages.
- [ ] Production analytics and error monitoring.

### Exit criteria

- User can buy credits with PayPal.
- Successful payment grants credits exactly once.
- Free conversion still works while logged out.

---

## Phase 3 — Advanced cloud transcription

Goal: prove the first paid value proposition: cleaner MIDI from mixed songs.

### Tasks

- [ ] Temporary object storage.
- [ ] Signed upload URL.
- [ ] Processing job state machine.
- [ ] Serverless GPU worker.
- [ ] Stem separation pipeline.
- [ ] Stem-specific transcription routing.
- [ ] Multi-track MIDI result.
- [ ] Credit charging/refund rules.
- [ ] Retry and failure UX.
- [ ] 24-hour temporary file cleanup.

### Exit criteria

- Mixed-song advanced processing materially improves usefulness compared with the free direct path.
- Unit economics can be measured per processed minute/job.

---

## Phase 4 — SEO validation

Goal: prove that the product can acquire high-intent organic users before scaling programmatic SEO.

### Initial routes

- [ ] `/audio-to-midi`
- [ ] `/mp3-to-midi`
- [ ] `/piano-to-midi`
- [ ] `/vocal-to-midi`
- [ ] `/guitar-to-midi`
- [ ] `/hum-to-midi`

Each page must include genuinely route-specific:

- use case copy
- recording/conversion guidance
- examples
- FAQs
- recommended settings
- internal links
- structured metadata where appropriate

### Exit criteria

- Search impressions and rankings are measurable.
- At least some landing pages generate meaningful tool usage.
- Do not expand to 50+ pages if the initial pages fail to generate qualified traffic.

---

## Phase 5 — Growth and monetization optimization

Goal: improve repeat usage, conversion, and acquisition efficiency.

### Tasks

- [ ] Credit-pack pricing experiments.
- [ ] Evaluate subscription after repeat-use data exists.
- [ ] Paddle onboarding evaluation.
- [ ] Add Paddle provider if approved.
- [ ] Reddit/producer community launch plan.
- [ ] Short-form demo content.
- [ ] Referral/share loops based on results, not spam.
- [ ] Retention cohort analysis.

---

## Phase 6 — Product moat

Goal: evolve from a wrapper around a transcription model into a differentiated transcription system.

### Candidate capabilities

- [ ] Source/instrument detection.
- [ ] Automatic pipeline routing.
- [ ] Instrument-specific presets/models.
- [ ] Smarter note cleanup.
- [ ] Quantization and timing repair.
- [ ] Key/BPM detection.
- [ ] Chord-aware cleanup.
- [ ] Better pitch-bend handling.
- [ ] Persistent projects.
- [ ] MusicXML/notation export only when justified by demand.

Long-term moat:

> Input understanding + routing + stem strategy + transcription selection + MIDI post-processing.
