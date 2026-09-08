# AI MIDI Workspace — Architecture

## 1. System goals

- Keep the free conversion path client-side wherever practical.
- Keep product code independent from payment providers.
- Keep browser audio code independent from server/database code.
- Introduce cloud GPU work only for value-added advanced processing.
- Preserve a clean path from MVP to a scalable SaaS.

## 2. High-level architecture

```text
Browser
├─ Next.js UI
├─ Audio decoder / waveform
├─ Web Worker transcription runtime
├─ Piano Roll
├─ MIDI preview / export
└─ Analytics client
      │
      ├──────── local free flow ────────┐
      │                                 │
      ▼                                 │
Next.js server                          │
├─ Auth                                │
├─ Billing adapters                    │
├─ Credits                             │
├─ Project metadata                    │
├─ Job API                             │
└─ Signed storage URLs                 │
      │                                 │
      ▼                                 │
PostgreSQL                              │
      │                                 │
      ▼                                 │
Temporary Object Storage                │
      │                                 │
      ▼                                 │
Async GPU Worker                        │
├─ stem separation                     │
├─ transcription routing               │
└─ artifact generation                 │
```

## 3. Web application

Recommended stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- existing component primitives / shadcn-compatible patterns

Suggested domain structure:

```text
app/
  (marketing)/
  studio/
  account/
  api/
components/
  studio/
  marketing/
  billing/
lib/
  audio/
  transcription/
  midi/
  billing/
  db/
  analytics/
workers/
  transcription.worker.ts
```

## 4. Audio domain

Responsibilities:

- input validation
- decoding
- duration inspection
- range selection
- waveform data
- light preprocessing

Do not couple this domain to React component state more than necessary. Prefer testable functions and adapters.

## 5. Transcription domain

Expose a stable interface so the MVP model can later be replaced or augmented.

Conceptual interface:

```ts
interface TranscriptionEngine {
  transcribe(input: AudioBufferLike, options: TranscriptionOptions): Promise<TranscriptionResult>;
}
```

`TranscriptionResult` should be model-independent and normalize to note events such as:

- pitch / MIDI note
- start time
- end time
- velocity/confidence when available
- pitch bend when available

Do not expose raw model tensors to UI code.

## 6. MIDI domain

Responsibilities:

- canonical note model
- selection/edit operations
- quantization
- playback scheduling data
- MIDI serialization
- future multi-track project representation

The Piano Roll should operate on this normalized MIDI-domain data, not directly on model outputs.

## 7. Worker model

Browser transcription must run in a Worker or equivalent off-main-thread execution path.

Messages should be explicit:

```text
LOAD_MODEL
MODEL_READY
TRANSCRIBE
PROGRESS
RESULT
ERROR
```

The UI must remain responsive during processing.

## 8. Billing abstraction

Core billing API should not depend on Stripe naming.

Suggested provider interface:

```ts
interface PaymentProvider {
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  capturePayment(input: CaptureInput): Promise<CaptureResult>;
  verifyWebhook(input: WebhookInput): Promise<VerifiedWebhookEvent>;
}
```

Initial provider:

- PayPal

Future providers:

- Paddle
- Stripe

Provider implementations may use provider-specific metadata internally, but persistence exposed to the rest of the app should stay generic.

## 9. Database domains

Expected core entities:

- users
- sessions / auth identities
- billing_customers
- payments
- credit_ledger
- subscriptions (future)
- projects (future/optional in MVP)
- processing_jobs
- generated_artifacts

Credits must use an append-only ledger or transaction-safe equivalent. Do not rely only on a mutable `credits_balance` integer without an audit trail.

## 10. Advanced processing jobs

State machine:

```text
created
→ awaiting_upload
→ queued
→ processing
→ succeeded
→ expired

failure path:
queued/processing → failed
```

Requirements:

- idempotent job creation and payment handling
- retry-safe workers
- bounded attempts
- structured failure reason
- user-visible status
- temporary source and result retention

## 11. Storage

Free local flow:

- no upload

Cloud Pro flow:

- direct browser upload via signed URL
- short-lived source object
- short-lived generated stems/artifacts where possible
- automatic lifecycle deletion, target 24 hours for temporary raw audio unless a user-facing feature explicitly requires longer retention

## 12. Security

- Never expose PayPal secrets to client code.
- Verify all payment callbacks/webhooks server-side.
- Validate file metadata and decoded characteristics, not only file extensions.
- Enforce duration/size caps for cloud jobs.
- Do not trust client-submitted credit amounts or prices.
- Keep storage private by default.
- Use signed URLs with short TTLs.
- Strip user-supplied filenames from internal object keys when practical.

## 13. SEO architecture

SEO pages should share one converter shell but provide route-specific content.

Initial routes after core product validation:

- audio-to-midi
- mp3-to-midi
- piano-to-midi
- vocal-to-midi
- guitar-to-midi
- hum-to-midi

Avoid generating dozens of near-duplicate pages before validating search performance and product usefulness.

## 14. Observability

Minimum:

- structured application errors
- transcription failure telemetry
- processing duration metrics
- job failures
- checkout and payment failures
- product funnel analytics

Never send raw private audio as analytics payloads.

## 15. Evolution path

Phase 0/1:

- client transcription
- Piano Roll
- MIDI export

Phase 2:

- auth/database/payment/credits

Phase 3:

- temporary cloud processing
- stem separation
- multi-track results

Phase 4:

- intelligent routing by source/instrument
- multiple transcription engines/presets
- project persistence

The long-term technical moat is not a single open model. It is a better routing and post-processing pipeline that chooses the right processing strategy for different musical inputs.
