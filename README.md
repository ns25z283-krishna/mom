# Meeting Recorder

Record a meeting and get a transcript with every speaker, plus a draft of the minutes, all inside the browser. The recording is never uploaded.

**Open the GitHub Pages link in Chrome or Edge on a computer.**

## What it does
1. **Records** your mic plus the Zoom, Teams or Meet call audio (or just the room) into one MP3. Optional screen video.
2. **Live captions** while you record (Chrome/Edge speech service, needs internet; can be turned off).
3. **After you stop**, in the page itself:
   - finds the different voices and labels them Speaker 1, Speaker 2... A voice keeps the same number every time it speaks again;
   - renames a speaker automatically when they introduce themselves ("this is Priya");
   - writes the full transcript with Whisper;
   - drafts the minutes: attendees, key points, decisions, action items with owner and due date.
4. **Exports** a Word document (minutes + transcript), a text file, and subtitles (.srt).

You can also open an existing recording (MP3, M4A, WAV, MP4) with "Open a recording…".

The first transcript downloads the speech models (about 190 MB) from this site and keeps them in the browser, so later runs start straight away. A 1-hour meeting takes roughly 30–60 minutes to transcribe, depending on the computer.

## Files (keep them all together in the repo's top folder)
- `index.html`: the app (MP3 encoder built in)
- `engine-worker.js`, `sherpa-onnx.js`, `sherpa-onnx.wasm`: the speech engine
- `speaker-segmentation.onnx`, `speaker-embedding.onnx.part0-1`: speaker detection models
- `whisper-base-encoder.onnx.part0-1`, `whisper-base-decoder.onnx.part0-6`, `whisper-base-tokens.txt`: transcription model
- Licence files for the bundled components

Large models are split into parts under 25 MB so they can be uploaded through GitHub's website.

## Credits
sherpa-onnx (Apache-2.0), pyannote segmentation 3.0 (MIT), 3D-Speaker ERes2Net (Apache-2.0), OpenAI Whisper (MIT), lamejs (LGPL).
