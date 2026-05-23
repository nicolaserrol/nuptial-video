import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { useBrand } from "../brand/BrandTheme";
import { TextReveal } from "./TextReveal";

type Props = {
  audioSrc?: string;
  headline: string;
  subhead?: string;
  background?: React.ReactNode;
  /** Tint over background for legibility. */
  tint?: string;
};

export const CaptionedScene: React.FC<Props> = ({
  audioSrc,
  headline,
  subhead,
  background,
  tint,
}) => {
  const brand = useBrand();
  return (
    <AbsoluteFill style={{ background: brand.gradients.blush }}>
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
        <TextReveal
          text={headline}
          font="serif"
          weight={700}
          fontSize={86}
          color={brand.colors.rose[800]}
        />
        {subhead ? (
          <>
            <div style={{ height: 24 }} />
            <TextReveal
              text={subhead}
              delay={10}
              font="sans"
              weight={500}
              fontSize={34}
              color={brand.colors.ink}
            />
          </>
        ) : null}
      </AbsoluteFill>
      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}
    </AbsoluteFill>
  );
};
