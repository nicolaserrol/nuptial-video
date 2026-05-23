import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../brand/BrandTheme";
import { TextReveal } from "./TextReveal";

type Props = {
  headline: string;
  subhead: string;
  url: string;
};

export const CTAEndCard: React.FC<Props> = ({ headline, subhead, url }) => {
  const brand = useBrand();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonProgress = spring({
    frame: frame - 22,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const buttonScale = interpolate(buttonProgress, [0, 1], [0.9, 1]);
  const buttonOpacity = interpolate(buttonProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: brand.gradients.blush,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <img
        src={staticFile(brand.logo)}
        alt=""
        style={{ width: 120, height: 120, borderRadius: 24, objectFit: "contain", marginBottom: 32 }}
      />
      <TextReveal
        text={headline}
        font="serif"
        weight={700}
        fontSize={92}
        color={brand.colors.rose[800]}
      />
      <div style={{ height: 28 }} />
      <TextReveal
        text={subhead}
        delay={8}
        font="sans"
        weight={500}
        fontSize={36}
        color={brand.colors.ink}
      />
      <div
        style={{
          marginTop: 56,
          padding: "20px 44px",
          borderRadius: 999,
          background: brand.gradients.romance,
          color: brand.colors.white,
          fontFamily: brand.fonts.sans,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "0.02em",
          boxShadow: "0 24px 56px rgba(190, 18, 60, 0.35)",
          transform: `scale(${buttonScale})`,
          opacity: buttonOpacity,
        }}
      >
        {url}
      </div>
    </AbsoluteFill>
  );
};
