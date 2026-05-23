import { createHash } from "node:crypto";
import { mkdirSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

export type ElevenLabsVoiceSettings = {
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
};

export type ElevenLabsLine = {
  /** Stable identifier used as the filename (e.g. "scene-01-intro"). */
  id: string;
  text: string;
  voiceId?: string;
  modelId?: string;
  voiceSettings?: ElevenLabsVoiceSettings;
};

export type GenerateVoiceoverOptions = {
  /** Output directory, relative to repo root. Defaults to public/voiceover/<compositionId>. */
  outDir: string;
  /** Cache manifest path. Defaults to <outDir>/.cache.json. */
  cachePath?: string;
  apiKey?: string;
  defaultVoiceId?: string;
  defaultModelId?: string;
  defaultVoiceSettings?: ElevenLabsVoiceSettings;
};

type CacheEntry = { hash: string; file: string };
type CacheManifest = Record<string, CacheEntry>;

const DEFAULT_VOICE_SETTINGS: ElevenLabsVoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.35,
  use_speaker_boost: true,
};

const ENDPOINT = "https://api.elevenlabs.io/v1/text-to-speech";

const hashOf = (text: string, voiceId: string, modelId: string) =>
  createHash("sha256")
    .update(`${voiceId}::${modelId}::${text}`)
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

export async function generateVoiceover(
  lines: ElevenLabsLine[],
  options: GenerateVoiceoverOptions,
): Promise<{ id: string; file: string; cached: boolean }[]> {
  const apiKey = options.apiKey ?? process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ELEVENLABS_API_KEY is not set. Add it to .env or pass apiKey explicitly.",
    );
  }
  const defaultVoiceId =
    options.defaultVoiceId ?? process.env.ELEVENLABS_VOICE_ID;
  if (!defaultVoiceId) {
    throw new Error(
      "ELEVENLABS_VOICE_ID is not set. Add it to .env or pass defaultVoiceId.",
    );
  }
  const defaultModelId =
    options.defaultModelId ??
    process.env.ELEVENLABS_MODEL_ID ??
    "eleven_turbo_v2_5";

  mkdirSync(options.outDir, { recursive: true });
  const cachePath = options.cachePath ?? join(options.outDir, ".cache.json");
  const cache = loadCache(cachePath);

  const results: { id: string; file: string; cached: boolean }[] = [];

  for (const line of lines) {
    const voiceId = line.voiceId ?? defaultVoiceId;
    const modelId = line.modelId ?? defaultModelId;
    const hash = hashOf(line.text, voiceId, modelId);
    const file = join(options.outDir, `${line.id}.mp3`);
    const prior = cache[line.id];

    if (prior && prior.hash === hash && existsSync(file)) {
      results.push({ id: line.id, file, cached: true });
      continue;
    }

    const voiceSettings = {
      ...DEFAULT_VOICE_SETTINGS,
      ...options.defaultVoiceSettings,
      ...line.voiceSettings,
    };

    const res = await fetch(`${ENDPOINT}/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: line.text,
        model_id: modelId,
        voice_settings: voiceSettings,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `ElevenLabs TTS failed for "${line.id}" (${res.status}): ${body}`,
      );
    }

    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(file, buf);
    cache[line.id] = { hash, file };
    saveCache(cachePath, cache);
    results.push({ id: line.id, file, cached: false });
  }

  return results;
}
