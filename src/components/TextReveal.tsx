import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../brand/BrandTheme";

type Props = {
  text: string;
  delay?: number;
  fontSize?: number;
  font?: "serif" | "sans";
  color?: string;
  align?: "left" | "center" | "right";
  weight?: number;
  lineHeight?: number;
};

export const TextReveal: React.FC<Props> = ({
  text,
  delay = 0,
  fontSize = 84,
  font = "serif",
  color,
  align = "center",
  weight = 600,
  lineHeight = 1.1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = useBrand();
  const fillColor = color ?? brand.colors.ink;

  const lines = text.split("\n");
  return (
    <div style={{ textAlign: align, width: "100%" }}>
      {lines.map((line, i) => {
        const lineDelay = delay + i * 4;
        const progress = spring({
          frame: frame - lineDelay,
          fps,
          config: { damping: 18, stiffness: 90, mass: 0.6 },
        });
        const y = interpolate(progress, [0, 1], [40, 0]);
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        return (
          <div
            key={i}
            style={{
              fontFamily:
                font === "serif" ? brand.fonts.serif : brand.fonts.sans,
              fontSize,
              fontWeight: weight,
              color: fillColor,
              lineHeight,
              letterSpacing: font === "serif" ? "-0.01em" : "-0.02em",
              opacity,
              transform: `translateY(${y}px)`,
              whiteSpace: "pre-wrap",
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
