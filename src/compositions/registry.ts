// Composition registry — single source of truth for every video this repo can render.
//
// Add a new video by:
//   1. Building a template module under `src/compositions/templates/`
//      exporting `component`, `schema`, `calculateMetadata`.
//   2. Appending a TemplateRegistration here with its formats.
//   3. (Optional) Adding scripts under SCRIPTS keyed by each format's id.

import type { CalculateMetadataFunction } from "remotion";
import type { ComponentType } from "react";
import type { ZodTypeAny } from "zod";
import {
  NuptialPromo,
  nuptialPromoSchema,
  calculateNuptialPromoMetadata,
  type NuptialPromoProps,
} from "./templates/nuptial-promo";
import { GENERATED_VIDEOS } from "../content/videos";

export type AspectFormat = {
  /** Composition id used in Studio + renderer. */
  id: string;
  width: number;
  height: number;
  /** Extra prop overrides for this format (merged into the template's defaults). */
  propOverrides?: Record<string, unknown>;
};

export type TemplateRegistration<Props extends { compositionId: string }> = {
  /** Template family id, e.g. "nuptial-promo". */
  id: string;
  description: string;
  component: ComponentType<Props>;
  schema: ZodTypeAny;
  fps: number;
  fallbackDurationInFrames: number;
  defaultProps: Omit<Props, "compositionId">;
  calculateMetadata: CalculateMetadataFunction<Props>;
  formats: AspectFormat[];
};

const BUILT_IN_TEMPLATES: TemplateRegistration<NuptialPromoProps>[] = [
  {
    id: "nuptial-promo",
    description:
      "Three-to-five-scene voiceover promo with branded background, captions, and CTA end card.",
    component: NuptialPromo,
    schema: nuptialPromoSchema,
    fps: 30,
    fallbackDurationInFrames: 20 * 30,
    defaultProps: { showLowerThird: true, showCaptions: true, transition: "fade" },
    calculateMetadata: calculateNuptialPromoMetadata,
    formats: [
      { id: "NuptialReel", width: 1080, height: 1920 },
      {
        id: "NuptialSquare",
        width: 1080,
        height: 1080,
        propOverrides: { showLowerThird: false },
      },
      { id: "NuptialLandscape", width: 1920, height: 1080 },
    ],
  },
];

const templateById = new Map(BUILT_IN_TEMPLATES.map((t) => [t.id, t]));

/** Expand each generated video into its own TemplateRegistration so each
 *  video shows up as its own group of compositions in Studio. */
const GENERATED_TEMPLATES: TemplateRegistration<NuptialPromoProps>[] =
  GENERATED_VIDEOS.map((video) => {
    const base = templateById.get(video.templateId);
    if (!base) {
      throw new Error(
        `Generated video "${video.id}" references unknown template "${video.templateId}".`,
      );
    }
    return {
      ...base,
      id: `${base.id}:${video.id}`,
      description: `${video.title} — uses ${base.id}`,
      formats: video.formats.map((f) => ({
        id: `${video.id}${f.suffix}`,
        width: f.width,
        height: f.height,
        propOverrides: f.propOverrides,
      })),
    };
  });

export const TEMPLATES: TemplateRegistration<NuptialPromoProps>[] = [
  ...BUILT_IN_TEMPLATES,
  ...GENERATED_TEMPLATES,
];
