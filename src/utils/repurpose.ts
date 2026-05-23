// Atomic units extracted from a video script — useful for repurposing a
// single render into clips, captions, posts, and thumbnails downstream.

import { existsSync } from "node:fs";
import { join } from "node:path";
import type { VideoScript } from "../content/scripts";

export type ContentAtom = {
  id: string;
  index: number;
  /** Frame range within the parent composition. */
  startFrame: number;
  endFrame: number;
  /** Seconds (derived from fps) for ffmpeg/social tooling. */
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  /** Narration spoken in this clip (from ElevenLabsLine). */
  narration?: string;
  /** On-screen headline. */
  headline: string;
  subhead?: string;
  /** Suggested short caption for social posts (≤180 chars). */
  suggestedCaption: string;
};

const trimToCaptionLength = (text: string, max = 180): string => {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
};

/**
 * Slice a script into per-scene atoms using pre-computed scene durations.
 * Use this when you already know each scene's length (e.g., from
 * calculateMetadata output) and don't want to re-read MP3s.
 */
export const atomsFromScript = (
  script: VideoScript,
  sceneDurations: number[],
  fps: number,
): ContentAtom[] => {
  const linesById = new Map(script.lines.map((l) => [l.id, l]));
  let cursor = 0;
  return script.scenes.map((scene, index) => {
    const dur = sceneDurations[index] ?? 0;
    const startFrame = cursor;
    const endFrame = cursor + dur;
    cursor = endFrame;
    const narration = linesById.get(scene.id)?.text;
    const caption = trimToCaptionLength(
      [scene.headline.replace(/\n/g, " "), scene.subhead].filter(Boolean).join(" — "),
    );
    return {
      id: scene.id,
      index,
      startFrame,
      endFrame,
      startSeconds: startFrame / fps,
      endSeconds: endFrame / fps,
      durationSeconds: dur / fps,
      narration,
      headline: scene.headline,
      subhead: scene.subhead,
      suggestedCaption: caption,
    };
  });
};

/**
 * Node-only: read MP3 durations from public/voiceover/<compositionId>/ and
 * return atoms. Falls back to a 3s default per scene when audio is missing.
 */
export const atomsFromScriptOnDisk = async (
  script: VideoScript,
  compositionId: string,
  fps: number,
  publicDir = join(process.cwd(), "public"),
): Promise<ContentAtom[]> => {
  const { getAudioDurationInSeconds } = await import("@remotion/media-utils");
  const FALLBACK = 3;
  const durations = await Promise.all(
    script.lines.map(async (line) => {
      const filePath = join(publicDir, "voiceover", compositionId, `${line.id}.mp3`);
      if (!existsSync(filePath)) return Math.round(FALLBACK * fps);
      try {
        const seconds = await getAudioDurationInSeconds(filePath);
        return Math.ceil((seconds + 0.35) * fps);
      } catch {
        return Math.round(FALLBACK * fps);
      }
    }),
  );
  return atomsFromScript(script, durations, fps);
};
