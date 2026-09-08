'use client';

import { useCallback, useRef, useState } from 'react';
import { FileAudio, LockKeyhole, Upload } from 'lucide-react';

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const SUPPORTED_EXTENSIONS = ['mp3', 'wav', 'm4a', 'flac'];

function getExtension(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

function validateAudioFile(file: File) {
  const extension = getExtension(file.name);

  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    return 'Unsupported format. Choose an MP3, WAV, M4A, or FLAC file.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'This file is larger than the current 50 MB MVP limit.';
  }

  return null;
}

export function AudioDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectFile = useCallback((file: File) => {
    const validationError = validateAudioFile(file);

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);
  }, []);

  return (
    <div className="space-y-4">
      <div
        className={`group rounded-2xl border border-dashed p-8 transition md:p-12 ${
          dragActive
            ? 'border-zinc-400 bg-zinc-900/80'
            : 'border-zinc-700 bg-zinc-950/70 hover:border-zinc-500'
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          const file = event.dataTransfer.files?.[0];
          if (file) selectFile(file);
        }}
      >
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept=".mp3,.wav,.m4a,.flac,audio/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) selectFile(file);
          }}
        />

        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
            {selectedFile ? (
              <FileAudio className="size-5 text-zinc-100" />
            ) : (
              <Upload className="size-5 text-zinc-100" />
            )}
          </div>

          <h2 className="text-xl font-medium tracking-tight text-zinc-50">
            {selectedFile ? selectedFile.name : 'Drop audio here'}
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {selectedFile
              ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB · ready for local decoding`
              : 'MP3, WAV, M4A, or FLAC. The free conversion path keeps your audio on this device.'}
          </p>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-100 px-4 text-sm font-medium text-zinc-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            {selectedFile ? 'Choose another file' : 'Choose audio'}
          </button>

          <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
            <LockKeyhole className="size-3.5" />
            <span>Local-first processing · no upload in the free flow</span>
          </div>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
