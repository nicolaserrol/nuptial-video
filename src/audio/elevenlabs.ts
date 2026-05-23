import { createHash } from "node:crypto";
import { mkdirSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import type { Readable } from "node:stream";

/**
 * Voice options for Microsoft Edge TTS.
 * `rate`, `pitch`, `volume` accept SSML-style relative strings, e.g. "+10%", "-5%", "0%".
 */
export type ElevenLabsVoiceSettings = {
  rate?: string;
  pitch?: string;
  volume?: string;
};

export type ElevenLabsLine = {
  /** Stable identifier used as the filename (e.g. "scene-01-intro"). */
  id: string;
  text: string;
  /** Edge TTS voice name, e.g. "en-US-AvaMultilingualNeural". */
  voiceId?: string;
  /** Unused for Edge TTS; kept for back-compat with existing scripts. */
  modelId?: string;
  voiceSettings?: ElevenLabsVoiceSettings;
};

export type GenerateVoiceoverOptions = {
  outDir: string;
  cachePath?: string;
  /** Unused for Edge TTS — kept for API back-compat. */
  apiKey?: string;
  defaultVoiceId?: string;
  defaultModelId?: string;
  defaultVoiceSettings?: ElevenLabsVoiceSettings;
};

type CacheEntry = { hash: string; file: string };
type CacheManifest = Record<string, CacheEntry>;

const DEFAULT_VOICE = "en-US-AvaMultilingualNeural";

const hashOf = (text: string, voice: string, settings: ElevenLabsVoiceSettings) =>
  createHash("sha256")
    .update(`${voice}::${JSON.stringify(settings)}::${text}`)
    .digest("hex")
    .slice(0, 16);

const loadCache = (path: string): CacheManifest => {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as CacheManifest;
  } catch {
    return {};
  }
};

const saveCache = (path: string, cache: CacheManifest) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(cache, null, 2));
};

const streamToBuffer = (stream: Readable): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(Buffer.concat(chunks));
    };
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", finish);
    stream.on("close", finish);
    stream.on("error", (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    });
  });

export async function generateVoiceover(
  lines: ElevenLabsLine[],
  options: GenerateVoiceoverOptions,
): Promise<{ id: string; file: string; cached: boolean }[]> {
  const defaultVoice =
    options.defaultVoiceId ??
    process.env.EDGE_TTS_VOICE ??
    DEFAULT_VOICE;

  mkdirSync(options.outDir, { recursive: true });
  const cachePath = options.cachePath ?? join(options.outDir, ".cache.json");
  const cache = loadCache(cachePath);

  const results: { id: string; file: string; cached: boolean }[] = [];

  for (const line of lines) {
    const voice = line.voiceId ?? defaultVoice;
    const voiceSettings: ElevenLabsVoiceSettings = {
      ...options.defaultVoiceSettings,
      ...line.voiceSettings,
    };
    const hash = hashOf(line.text, voice, voiceSettings);
    const file = join(options.outDir, `${line.id}.mp3`);
    const prior = cache[line.id];

    if (prior && prior.hash === hash && existsSync(file)) {
      results.push({ id: line.id, file, cached: true });
      continue;
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(
      voice,
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
    );

    let buf: Buffer;
    try {
      const prosody: Record<string, string> = {};
      if (voiceSettings.rate) prosody.rate = voiceSettings.rate;
      if (voiceSettings.pitch) prosody.pitch = voiceSettings.pitch;
      if (voiceSettings.volume) prosody.volume = voiceSettings.volume;
      const { audioStream } = tts.toStream(
        line.text,
        Object.keys(prosody).length ? prosody : undefined,
      );
      buf = await streamToBuffer(audioStream as unknown as Readable);
    } catch (err) {
      throw new Error(
        `Edge TTS failed for "${line.id}": ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }

    if (buf.length === 0) {
      throw new Error(
        `Edge TTS produced empty audio for "${line.id}" (voice="${voice}"). Check voice name.`,
      );
    }

    writeFileSync(file, buf);
    cache[line.id] = { hash, file };
    saveCache(cachePath, cache);
    results.push({ id: line.id, file, cached: false });
  }

  return results;
}
