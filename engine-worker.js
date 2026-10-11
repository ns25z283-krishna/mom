// Speech engine worker: speaker separation (pyannote + 3D-Speaker ERes2Net) and
// transcription (Whisper base), both running in the browser through sherpa-onnx.
importScripts('sherpa-onnx.js');

const CACHE = 'meeting-recorder-models-v2';
let mod = null, diarizer = null, recognizer = null;

async function fetchModel(name, parts) {
  const cache = self.caches ? await caches.open(CACHE).catch(() => null) : null;
  const chunks = [];
  for (const url of parts) {
    let res = cache && await cache.match(url);
    if (!res) {
      res = await fetch(url);
      if (!res.ok) throw new Error(`Could not download ${url} (${res.status}). Check that all the files from the zip are in your GitHub repo.`);
      if (cache) await cache.put(url, res.clone()).catch(() => {});
    }
    chunks.push(new Uint8Array(await res.arrayBuffer()));
  }
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total); let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  mod.FS.writeFile('/' + name, out);
}

async function boot() {
  if (mod) return;
  const m = { locateFile: p => p.endsWith('.wasm') ? 'sherpa-onnx.wasm' : p, print: () => {}, printErr: () => {} };
  await Module(m);
  mod = m;
}

async function initDiarizer(models, numSpeakers) {
  await boot();
  await fetchModel('seg.onnx', models.segmentation);
  await fetchModel('emb.onnx', models.embedding);
  diarizer = createOfflineSpeakerDiarization(mod, {
    segmentation: { pyannote: { model: '/seg.onnx', windowShiftRatio: 0.5 }, numThreads: 1 },
    embedding: { model: '/emb.onnx', numThreads: 1 },
    clustering: { numClusters: numSpeakers > 0 ? numSpeakers : -1, threshold: 0.7 },
    minDurationOn: 0.3, minDurationOff: 0.5,
  });
  mod.FS.unlink('/seg.onnx'); mod.FS.unlink('/emb.onnx');
}

async function initRecognizer(models, language, task) {
  await boot();
  await fetchModel('enc.onnx', models.encoder);
  await fetchModel('dec.onnx', models.decoder);
  await fetchModel('tokens.txt', models.tokens);
  recognizer = new OfflineRecognizer({
    featConfig: { sampleRate: 16000, featureDim: 80 },
    modelConfig: {
      whisper: { encoder: '/enc.onnx', decoder: '/dec.onnx', language, task: task || 'transcribe', tailPaddings: -1 },
      tokens: '/tokens.txt', numThreads: 1, provider: 'cpu', modelType: 'whisper',
    },
  }, mod);
  mod.FS.unlink('/enc.onnx'); mod.FS.unlink('/dec.onnx');
}

onmessage = async ({ data }) => {
  try {
    if (data.type === 'init-diarizer') { await initDiarizer(data.models, data.numSpeakers); postMessage({ type: 'ready' }); }
    else if (data.type === 'init-recognizer') { await initRecognizer(data.models, data.language, data.task); postMessage({ type: 'ready' }); }
    else if (data.type === 'diarize') {
      const segs = diarizer.process(data.samples);
      postMessage({ type: 'segments', segments: segs.map(s => ({ start: s.start, end: s.end, speaker: s.speaker })) });
    } else if (data.type === 'transcribe') {
      const st = recognizer.createStream();
      st.acceptWaveform(16000, data.samples);
      recognizer.decode(st);
      const text = recognizer.getResult(st).text.trim();
      st.free();
      postMessage({ type: 'text', id: data.id, text });
    }
  } catch (e) {
    postMessage({ type: 'error', id: data.id, message: String(e && e.message || e) });
  }
};
