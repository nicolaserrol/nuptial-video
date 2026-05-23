import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
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

  // Card lifts up from below with overshoot, then settles.
  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.9 },
  });
  const cardY = interpolate(cardProgress, [0, 1], [80, 0]);
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);

  // Logo spring-in.
  const logoProgress = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0.5, 1]);
  const logoRotate = interpolate(logoProgress, [0, 1], [-8, 0]);

  // URL pill enters.
  const buttonProgress = spring({
    frame: frame - 22,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const buttonScale = interpolate(buttonProgress, [0, 1], [0.9, 1]);
  const buttonOpacity = interpolate(buttonProgress, [0, 1], [0, 1]);

  // After the URL settles, sine-pulse the glow ring.
  const pulse = Math.max(0, frame - 38);
  const glowStrength = (Math.sin(pulse / 7) + 1) / 2; // 0..1
  const glowBlur = interpolate(glowStrength, [0, 1], [32, 64]);
  const glowAlpha = interpolate(glowStrength, [0, 1], [0.35, 0.7]);

  // Final whole-card gentle scale pulse.
  const finalPulse = Math.max(0, frame - 52);
  const finalScale = 1 + Math.sin(finalPulse / 10) * 0.012;

  return (
    <AbsoluteFill
      style={{
        background: "transparent",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          transform: `translateY(${cardY}px) scale(${finalScale})`,
          opacity: cardOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          willChange: "transform, opacity",
        }}
      >
        <Img
          src={staticFile(brand.logo)}
          alt=""
          style={{
            width: 120,
            height: 120,
            borderRadius: 24,
            objectFit: "contain",
            marginBottom: 32,
            transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
            boxShadow: "0 18px 48px rgba(190, 18, 60, 0.25)",
          }}
        />
        <TextReveal
          text={headline}
          font="serif"
          weight={700}
          fontSize={92}
          color={brand.colors.rose[800]}
          mode="word"
        />
        <div style={{ height: 28 }} />
        <TextReveal
          text={subhead}
          delay={10}
          font="sans"
          weight={500}
          fontSize={36}
          color={brand.colors.ink}
          mode="word"
        />
        <div
          style={{
            position: "relative",
            marginTop: 56,
            transform: `scale(${buttonScale})`,
            opacity: buttonOpacity,
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: -18,
              borderRadius: 999,
              background: brand.gradients.romance,
              filter: `blur(${glowBlur}px)`,
              opacity: glowAlpha,
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "relative",
              padding: "20px 44px",
              borderRadius: 999,
              background: brand.gradients.romance,
              color: brand.colors.white,
              fontFamily: brand.fonts.sans,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: "0.02em",
              boxShadow: "0 24px 56px rgba(190, 18, 60, 0.35)",
              zIndex: 1,
            }}
          >
            {url}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
