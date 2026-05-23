import type { Caption } from "../content/scripts";

const WORDS_PER_CHUNK = 3;

const splitWords = (text: string): string[] =>
  text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

const chunkWords = (words: string[], size: number): string[][] => {
  const chunks: string[][] = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size));
  }
  return chunks;
};

/**
 * Distribute caption chunks evenly across the scene duration.
 * Word-count weighted so longer chunks linger.
 */
export const autoCaptions = (
  text: string,
  durationFrames: number,
  options: { wordsPerChunk?: number; leadInFrames?: number } = {},
): Caption[] => {
  const words = splitWords(text);
  if (words.length === 0) return [];
  const chunks = chunkWords(words, options.wordsPerChunk ?? WORDS_PER_CHUNK);
  const leadIn = options.leadInFrames ?? 0;
  const available = Math.max(1, durationFrames - leadIn);
  const totalWords = words.length;

  let cursor = leadIn;
  const captions: Caption[] = [];
  for (const chunk of chunks) {
    const share = chunk.length / totalWords;
    const span = Math.max(8, Math.round(available * share));
    const from = cursor;
    const to = Math.min(durationFrames, cursor + span);
    captions.push({ text: chunk.join(" "), from, to });
    cursor = to;
  }
  return captions;
};
