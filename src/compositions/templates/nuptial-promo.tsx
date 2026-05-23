import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Series,
  type CalculateMetadataFunction,
  staticFile,
} from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { z } from "zod";
import { BrandTheme, useBrand } from "../../brand/BrandTheme";
import { CaptionedScene } from "../../components/CaptionedScene";
import { CTAEndCard } from "../../components/CTAEndCard";
import { LowerThird } from "../../components/LowerThird";
import { SceneTransition } from "../../components/SceneTransition";
import { SCRIPTS, resolveHeadline } from "../../content/scripts";
import { autoCaptions } from "../../utils/captions";

export const nuptialPromoSchema = z.object({
  compositionId: z.string(),
  showLowerThird: z.boolean().default(true),
  showCaptions: z.boolean().default(true),
  hookStyle: z
    .enum(["curiosity", "value", "contrarian", "transformation", "social-proof"])
    .optional(),
  transition: z
    .enum(["fade", "slide-up", "wipe", "none"])
    .default("fade"),
});

export type NuptialPromoProps = z.infer<typeof nuptialPromoSchema> & {
  sceneDurations?: number[];
  ctaDurationFrames?: number;
};

const FPS = 30;
const FALLBACK_SECONDS_PER_SCENE = 3;
const CTA_SECONDS = 4;

export const calculateNuptialPromoMetadata: CalculateMetadataFunction<
  NuptialPromoProps
> = async ({ props }) => {
  const script = SCRIPTS[props.compositionId];
  if (!script) {
    throw new Error(`No script registered for composition "${props.compositionId}"`);
  }

  const durations = await Promise.all(
    script.lines.map(async (line) => {
      const path = `voiceover/${props.compositionId}/${line.id}.mp3`;
      try {
        const seconds = await getAudioDurationInSeconds(staticFile(path));
        // Pad each line with a small breathing room.
        return Math.ceil((seconds + 0.35) * FPS);
      } catch {
        return FALLBACK_SECONDS_PER_SCENE * FPS;
      }
    }),
  );

  const ctaDurationFrames = CTA_SECONDS * FPS;
  const totalFrames =
    durations.reduce((sum, d) => sum + d, 0) + ctaDurationFrames;

  return {
    durationInFrames: totalFrames,
    fps: FPS,
    props: {
      ...props,
      sceneDurations: durations,
      ctaDurationFrames,
    },
  };
};

export const NuptialPromo: React.FC<NuptialPromoProps> = ({
  compositionId,
  showLowerThird,
  showCaptions,
  hookStyle,
  transition,
  sceneDurations,
  ctaDurationFrames,
}) => {
  const script = SCRIPTS[compositionId];
  const durations =
    sceneDurations ?? script.lines.map(() => FALLBACK_SECONDS_PER_SCENE * FPS);
  const ctaFrames = ctaDurationFrames ?? CTA_SECONDS * FPS;
  const linesById = new Map(script.lines.map((l) => [l.id, l]));

  return (
    <BrandTheme>
      <Background />
      <Series>
        {script.scenes.map((scene, idx) => {
          const line = linesById.get(scene.id);
          const captions =
            showCaptions === false
              ? undefined
              : (scene.captions ??
                (line ? autoCaptions(line.text, durations[idx]) : undefined));
          return (
            <Series.Sequence key={scene.id} durationInFrames={durations[idx]}>
              <SceneTransition
                durationInFrames={durations[idx]}
                kind={transition}
              >
                <CaptionedScene
                  audioSrc={`voiceover/${compositionId}/${scene.id}.mp3`}
                  headline={resolveHeadline(scene, hookStyle)}
                  subhead={scene.subhead}
                  captions={captions}
                />
              </SceneTransition>
            </Series.Sequence>
          );
        })}
        <Series.Sequence durationInFrames={ctaFrames}>
          <SceneTransition durationInFrames={ctaFrames} kind={transition}>
            <CTAEndCard
              headline={script.cta.headline}
              subhead={script.cta.subhead}
              url={script.cta.url}
            />
          </SceneTransition>
        </Series.Sequence>
      </Series>
      {showLowerThird ? (
        <Sequence from={Math.floor(durations[0] / 2)}>
          <LowerThird label="Nuptial" sublabel="nuptial.app" />
        </Sequence>
      ) : null}
    </BrandTheme>
  );
};

const Background: React.FC = () => {
  const brand = useBrand();
  return <AbsoluteFill style={{ background: brand.gradients.blush }} />;
};
