import type { VideoScript } from "../scripts";

export type VideoFormat = {
  /** Suffix appended to the video id to produce the composition id. */
  suffix: string;
  width: number;
  height: number;
  /** Per-format prop overrides merged into the template's default props. */
  propOverrides?: Record<string, unknown>;
};

/**
 * A generated video module. One file per video under src/content/videos/.
 * The scaffolder (scripts/scaffold-video.ts) writes these from a JSON spec.
 */
export type VideoModule = {
  /** Base id (PascalCase). Composition ids become `${id}${suffix}`. */
  id: string;
  /** Which template renders this video. */
  templateId: "nuptial-promo";
  /** Human-readable title for logs/Studio. */
  title: string;
  formats: VideoFormat[];
  /** Shared script body — voiceover lines, scenes, CTA, metadata. */
  script: VideoScript;
};
