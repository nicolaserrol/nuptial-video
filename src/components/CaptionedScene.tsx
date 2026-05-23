import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useBrand } from "../brand/BrandTheme";
import { TextReveal } from "./TextReveal";
import { Captions } from "./Captions";
import type { Caption } from "../content/scripts";

type Props = {
  audioSrc?: string;
  headline: string;
  subhead?: string;
  background?: React.ReactNode;
  /** Tint over background for legibility. */
  tint?: string;
  captions?: Caption[];
};

export const CaptionedScene: React.FC<Props> = ({
  audioSrc,
  headline,
  subhead,
  background,
  tint,
  captions,
}) => {
  const brand = useBrand();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slow Ken-Burns-style parallax on the headline block: gentle drift + micro scale.
  const driftY = interpolate(frame, [0, durationInFrames], [12, -12]);
  const driftScale = interpolate(frame, [0, durationInFrames], [1.0, 1.03]);

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {background ? <AbsoluteFill>{background}</AbsoluteFill> : null}
      {tint ? <AbsoluteFill style={{ background: tint }} /> : null}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            transform: `translateY(${driftY}px) scale(${driftScale})`,
            willChange: "transform",
            maxWidth: "92%",
          }}
        >
          <TextReveal
            text={headline}
            font="serif"
            weight={700}
            fontSize={86}
            color={brand.colors.rose[800]}
            mode="word"
          />
          {subhead ? (
            <>
              <div style={{ height: 24 }} />
              <TextReveal
                text={subhead}
                delay={14}
                font="sans"
                weight={500}
                fontSize={34}
                color={brand.colors.ink}
                mode="word"
              />
            </>
          ) : null}
        </div>
      </AbsoluteFill>
      {captions && captions.length > 0 ? <Captions captions={captions} /> : null}
      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}
    </AbsoluteFill>
  );
};
