import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Series,
  type CalculateMetadataFunction,
  staticFile,
  useCurrentFrame,
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
          <LowerThird label="Nuptial" sublabel="nuptial-ph.com" />
        </Sequence>
      ) : null}
    </BrandTheme>
  );
};

const Background: React.FC = () => {
  const brand = useBrand();
  return (
    <AbsoluteFill style={{ background: brand.gradients.blush, overflow: "hidden" }}>
      <DriftingOrb
        color={brand.colors.pink[200]}
        size={1200}
        startX={-200}
        startY={-200}
        endX={120}
        endY={80}
        opacity={0.55}
      />
      <DriftingOrb
        color={brand.colors.rose[200]}
        size={900}
        startX={900}
        startY={1500}
        endX={650}
        endY={1200}
        opacity={0.45}
        delay={20}
      />
      <DriftingOrb
        color={brand.colors.pink[100]}
        size={700}
        startX={700}
        startY={-100}
        endX={500}
        endY={200}
        opacity={0.6}
        delay={40}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(31, 17, 23, 0.18) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const DriftingOrb: React.FC<{
  color: string;
  size: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  opacity: number;
  delay?: number;
}> = ({ color, size, startX, startY, endX, endY, opacity, delay = 0 }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);
  // Slow continuous drift across the whole video; sine wobble adds organic motion.
  const progress = (t / 240) % 1;
  const wobble = Math.sin(t / 45) * 30;
  const x = startX + (endX - startX) * progress + wobble;
  const y = startY + (endY - startY) * progress + Math.cos(t / 55) * 24;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${color} 0%, transparent 65%)`,
        opacity,
        filter: "blur(40px)",
      }}
    />
  );
};
