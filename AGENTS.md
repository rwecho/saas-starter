# AGENTS.md

## Project

AI MIDI Workspace — a privacy-first web application that turns musical ideas and audio into editable MIDI.

## Product principle

The project is not a generic file converter. It is an Audio → MIDI workspace optimized for fast conversion, immediate validation, editing, export, and later advanced stem-aware transcription.

## P0 success criterion

Before expanding SEO or SaaS features, validate the core product loop:

1. User uploads audio without signing in.
2. Audio is decoded locally.
3. Transcription runs in a Web Worker.
4. Notes appear in a Piano Roll.
5. User can preview and edit notes.
6. User exports a usable MIDI file.

Do not add features that do not materially improve this loop until the loop is validated.

## Technical constraints

- Next.js App Router + TypeScript.
- Tailwind CSS + existing component system.
- PostgreSQL + Drizzle ORM for persistent SaaS data.
- Payment logic must be provider-agnostic.
- PayPal is the first enabled provider.
- Stripe-specific columns must never be required by core billing tables.
- Browser-side transcription is the default for the free tier.
- Long-running or GPU tasks must be asynchronous jobs.
- Uploaded advanced-processing audio must use temporary storage and lifecycle deletion.
- No mandatory login for free local conversion.
- Core audio files must not be uploaded unless the user explicitly requests a cloud/Pro feature.

## Architecture boundaries

Keep these domains separate:

- `audio`: decoding, trimming, waveform, preprocessing.
- `transcription`: model adapters and transcription presets.
- `midi`: note model, editing, quantization, MIDI serialization.
- `billing`: providers, orders, credits, subscriptions.
- `jobs`: async advanced processing state machine.
- `analytics`: product funnel events.
- `seo`: static landing-page content and metadata.

Do not import payment-provider SDKs directly into product UI components.
Do not import database code into browser audio modules.
Do not place transcription logic directly inside React components.

## UI rules

- Tool-first layout. The converter is above marketing copy.
- Dark studio aesthetic, restrained and professional.
- Avoid decorative AI gradients and excessive glassmorphism.
- Initial state must be understandable in under 5 seconds.
- Conversion result state should progressively become a lightweight DAW-like workspace.
- Piano Roll P0 interactions: play/pause, zoom, select, delete, move pitch, resize note length.
- Keep advanced transcription parameters behind presets: Clean / Balanced / Detailed.

## P0 scope

Required:

- MP3/WAV/M4A/FLAC upload.
- Local decode.
- Optional range selection.
- Browser transcription adapter.
- Progress states.
- Piano Roll preview.
- Original/MIDI A/B preview.
- Basic note editing.
- MIDI export.
- Product analytics events.

Explicitly deferred:

- AI chat.
- Community.
- Mobile apps.
- Desktop apps.
- Public API.
- Full notation editor.
- Marketplace.
- Complex collaboration.

## Billing rules

Billing core should use generic records:

- provider
- provider_customer_id
- provider_payment_id
- type
- amount
- currency
- status

First monetization target: credit packs for advanced cloud processing.
Free local MIDI export must remain available during product validation.

## Quality gates

Before merging feature work:

- TypeScript must compile.
- Build must pass.
- Core conversion path must not require authentication.
- Audio must not leave the browser in the free flow.
- UI must work on current Chromium, Safari, and Firefox where supported.
- No secrets in client bundles.

## Analytics funnel

Track at minimum:

- `converter_view`
- `audio_selected`
- `audio_decoded`
- `transcription_started`
- `transcription_succeeded`
- `transcription_failed`
- `preview_played`
- `note_edited`
- `midi_exported`
- `advanced_processing_clicked`
- `checkout_started`
- `payment_succeeded`

Primary P0 metric: Upload → MIDI Export conversion rate.
