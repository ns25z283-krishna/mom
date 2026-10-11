# Meeting Recorder

Record any meeting (Zoom, Teams, Meet or in a room) and get an MP3, live captions, a transcript with every speaker numbered, and editable minutes of meeting. Everything runs inside the browser; recordings are never uploaded.

**Open the GitHub Pages link in Chrome or Edge on a computer.**

## Features
- **New meeting**: records your mic plus the call audio (or just the room) into one MP3, with an optional screen video.
- **Live captions** in English, Hindi/Hinglish, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali or Gujarati. Other languages are translated to English as people speak (Chrome's built-in translator, or Google Translate as a fallback).
- **Transcript** made in the page: speakers numbered Speaker 1, 2... (the same voice keeps its number), renamed automatically when someone says "I'm Priya". Non-English meetings are written in English.
- **Accuracy**: Standard (Whisper base, fast) or High (Whisper small, about 3x slower, much better for Hindi and other languages). "Best for the language" picks for you.
- **Minutes**: summary, topics, decisions, action items (owner, due date, done), key points and notes, all editable.
- **Word list**: names and special words (e.g. NoonRay) are corrected everywhere, including sound-alikes such as "no entry". Find & Replace in a transcript can be remembered for future meetings.
- **My meetings**: every meeting is saved in the browser to reopen later.
- **Exports**: Word, Print/PDF, text, subtitles (.srt), MP3, copy minutes.

The first transcript downloads the speech models from this site (about 190 MB for Standard, 400 MB for High) and keeps them in the browser.

## Files (keep them all in the repo's top folder)
- `index.html`: the app (MP3 encoder built in)
- `engine-worker.js`, `sherpa-onnx.js`, `sherpa-onnx.wasm`: the speech engine
- `speaker-segmentation.onnx`, `speaker-embedding.onnx.part*`: speaker detection
- `whisper-base-*`: Standard transcription model; `whisper-small-*`: High accuracy model
- Licence files for the bundled components

Large models are split into parts under 25 MB so they can be uploaded through GitHub's website.

## Credits
sherpa-onnx (Apache-2.0), pyannote segmentation 3.0 (MIT), 3D-Speaker ERes2Net (Apache-2.0), OpenAI Whisper (MIT), lamejs (LGPL).
