import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../brand/BrandTheme";

type Props = {
  label: string;
  sublabel?: string;
  delay?: number;
};

export const LowerThird: React.FC<Props> = ({ label, sublabel, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = useBrand();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.7 },
  });
  const x = interpolate(progress, [0, 1], [-60, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 48,
        bottom: 96,
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          gap: 6,
          background: brand.colors.white,
          padding: "14px 22px",
          borderRadius: 14,
          boxShadow: "0 12px 36px rgba(190, 18, 60, 0.18)",
          borderLeft: `4px solid ${brand.colors.rose[600]}`,
        }}
      >
        <div
          style={{
            fontFamily: brand.fonts.sans,
            fontWeight: 700,
            fontSize: 28,
            color: brand.colors.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </div>
        {sublabel ? (
          <div
            style={{
              fontFamily: brand.fonts.sans,
              fontWeight: 500,
              fontSize: 20,
              color: brand.colors.rose[700],
            }}
          >
            {sublabel}
          </div>
        ) : null}
      </div>
    </div>
  );
};
