import { AudioDropzone } from '@/components/studio/audio-dropzone';

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 md:px-8 md:py-8">
        <header className="flex items-center justify-between border-b border-zinc-900 pb-5">
          <div>
            <p className="text-sm font-medium tracking-tight text-zinc-100">AI MIDI Workspace</p>
            <p className="mt-0.5 text-xs text-zinc-500">Private, local-first audio transcription</p>
          </div>
          <div className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
            Phase 0 / 1
          </div>
        </header>

        <section className="flex flex-1 items-center py-12 md:py-20">
          <div className="w-full">
            <div className="mx-auto mb-9 max-w-2xl text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                Audio → editable MIDI
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
                Turn musical ideas into MIDI.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
                Start with a local audio file. Preview, clean, and export detected notes without uploading your music in the free flow.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <AudioDropzone />

              <div className="mt-5 grid gap-3 text-xs text-zinc-500 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-3">1. Decode locally</div>
                <div className="rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-3">2. Detect notes</div>
                <div className="rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-3">3. Preview & export MIDI</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
