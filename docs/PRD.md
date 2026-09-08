# AI MIDI Workspace — PRD

## 1. Product vision

Turn any musical idea into editable MIDI with the fastest possible path from audio to a usable result.

Core positioning:

> Private Audio-to-MIDI. Runs locally in your browser.

Long-term positioning:

> Turn any musical idea into editable MIDI.

## 2. Target users

### Producer
Wants to extract melody, bass, chords, riffs, or parts from audio into a DAW-editable MIDI workflow.

### Musician
Wants to convert piano, guitar, vocal, or other instrument recordings into editable notes.

### Creator
Wants to hum or record an idea and turn it into MIDI quickly.

### Learner
Wants to understand or recreate musical material from an audio source.

## 3. Jobs to be done

- Convert an audio clip to MIDI quickly.
- Validate the transcription before downloading.
- Clean obvious mistakes without leaving the browser.
- Export a MIDI file compatible with common DAWs.
- Later: separate a full mix into stems and create cleaner, multi-track MIDI.

## 4. Product principles

1. Tool first, marketing second.
2. No login required for local conversion.
3. Audio privacy is visible and real, not merely marketing copy.
4. Free result must be genuinely useful.
5. Paid features must improve transcription quality or save substantial time.
6. Avoid forcing subscriptions before usage frequency is proven.

## 5. MVP scope

### Upload

Supported input targets:

- MP3
- WAV
- M4A
- FLAC

Requirements:

- drag and drop
- file picker
- file validation
- clear failure messages
- audio remains local in free flow

### Waveform and range selection

- Render waveform after decoding.
- Allow user to select a range for transcription.
- Default to full clip when no range is selected.
- Surface selected duration.

### Transcription

- Run transcription outside the main UI thread.
- Provide progress states.
- Support presets:
  - Clean
  - Balanced
  - Detailed
- Advanced parameters may expose:
  - note/onset sensitivity
  - minimum note duration
  - pitch bend retention

### Piano Roll

P0 capabilities:

- display detected notes
- play/pause transport
- horizontal zoom
- vertical zoom
- select note
- delete note
- move pitch
- resize note duration

### Preview

- Original audio playback.
- MIDI rendering/playback.
- A/B or simultaneous comparison where technically stable.

### Export

- Standard MIDI download.
- Free in MVP.
- Export event tracked.

## 6. Paid feature hypothesis

First paid value proposition:

> Separate a mixed song into musical parts and transcribe those parts into cleaner MIDI tracks.

Potential cloud flow:

Audio → stem separation → stem-specific transcription → multi-track MIDI result.

Initial monetization should favor credits:

- low commitment
- suitable for bursty usage
- easy to test willingness to pay

Example packs for testing, not final pricing:

- $4.99 starter credits
- $9.99 producer credits
- $19.99 heavy-use credits

## 7. Deferred features

Not part of MVP:

- AI chat
- community
- marketplace
- desktop app
- mobile app
- public API
- collaboration
- full notation editor
- cloud project sync as a hard requirement

## 8. Pages

Initial product and trust pages:

- `/`
- `/studio`
- `/pricing`
- `/login`
- `/account`
- `/account/credits`
- `/account/billing`
- `/privacy`
- `/terms`
- `/contact`

Initial SEO pages after product validation:

- `/audio-to-midi`
- `/mp3-to-midi`
- `/piano-to-midi`
- `/vocal-to-midi`
- `/guitar-to-midi`
- `/hum-to-midi`

All converter landing pages should reuse the same functional converter shell while providing genuinely differentiated guidance, examples, and FAQs.

## 9. Analytics

Core funnel:

Visitor → Audio Selected → Transcription Success → Preview → MIDI Export → Advanced Feature Intent → Checkout → Payment

Primary MVP KPI:

`midi_exported / audio_selected`

Indicative decision thresholds after meaningful traffic:

- <15%: product quality or UX problem; do not scale SEO.
- 15–35%: continue improving core flow.
- >35%: promising.
- >50%: strong signal.

Secondary metrics:

- transcription failure rate
- median processing time
- preview rate
- note-edit rate
- repeat visitor rate
- advanced processing click rate
- paid conversion rate

## 10. Phase 0 validation

Build a benchmark set covering:

- piano solo
- vocal
- humming
- guitar solo
- bass
- lo-fi
- EDM
- rock
- classical
- dense full mixes

Score each sample for:

- note accuracy
- timing accuracy
- noise/mistaken notes
- usefulness after import into a DAW
- amount of manual cleanup needed

Do not assume one transcription pipeline works equally well for all sources.

## 11. Success definition

The product earns the right to scale when real users repeatedly reach a result they consider worth exporting.

The first milestone is not "website launched".

The first milestone is:

> A meaningful majority of representative test audio produces MIDI that a user would actually download and continue editing.
