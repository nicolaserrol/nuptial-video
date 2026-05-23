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
  /** "line" (default): each line springs in together. "word": staggered word-by-word kinetic reveal. */
  mode?: "line" | "word";
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
  mode = "word",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = useBrand();
  const fillColor = color ?? brand.colors.ink;
  const fontFamily = font === "serif" ? brand.fonts.serif : brand.fonts.sans;
  const letterSpacing = font === "serif" ? "-0.01em" : "-0.02em";

  const lines = text.split("\n");

  if (mode === "line") {
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
                fontFamily,
                fontSize,
                fontWeight: weight,
                color: fillColor,
                lineHeight,
                letterSpacing,
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
  }

  // Word-by-word kinetic stagger.
  let wordIndex = 0;
  return (
    <div style={{ textAlign: align, width: "100%" }}>
      {lines.map((line, lineIdx) => {
        const words = line.split(" ");
        return (
          <div
            key={lineIdx}
            style={{
              fontFamily,
              fontSize,
              fontWeight: weight,
              color: fillColor,
              lineHeight,
              letterSpacing,
              display: "flex",
              flexWrap: "wrap",
              justifyContent:
                align === "center"
                  ? "center"
                  : align === "right"
                    ? "flex-end"
                    : "flex-start",
              gap: "0.28em",
            }}
          >
            {words.map((word, w) => {
              const localDelay = delay + wordIndex * 2.2;
              wordIndex += 1;
              const progress = spring({
                frame: frame - localDelay,
                fps,
                config: { damping: 20, stiffness: 130, mass: 0.55 },
              });
              const y = interpolate(progress, [0, 1], [28, 0]);
              const blur = interpolate(progress, [0, 1], [8, 0]);
              const opacity = interpolate(progress, [0, 1], [0, 1]);
              return (
                <span
                  key={w}
                  style={{
                    display: "inline-block",
                    opacity,
                    transform: `translateY(${y}px)`,
                    filter: `blur(${blur}px)`,
                    willChange: "transform, opacity, filter",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
