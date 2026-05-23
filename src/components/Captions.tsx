import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useBrand } from "../brand/BrandTheme";
import type { Caption } from "../content/scripts";

type Props = {
  captions: Caption[];
  /** Distance from the bottom edge in px. */
  bottom?: number;
  fontSize?: number;
};

export const Captions: React.FC<Props> = ({
  captions,
  bottom = 180,
  fontSize = 42,
}) => {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const active = captions.find((c) => frame >= c.from && frame < c.to);
  if (!active) return null;

  const local = frame - active.from;
  const span = active.to - active.from;
  // Guard against captions shorter than 2 * fadeFrames (interpolate requires
  // strictly increasing input ranges).
  const fadeFrames = Math.max(1, Math.min(4, Math.floor(span / 3)));
  const opacity = interpolate(
    local,
    [0, fadeFrames, span - fadeFrames, span],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: brand.fonts.sans,
          fontWeight: 700,
          fontSize,
          letterSpacing: "-0.01em",
          color: brand.colors.white,
          background: "rgba(31, 17, 23, 0.78)",
          padding: "10px 22px",
          borderRadius: 14,
          maxWidth: "85%",
          textAlign: "center",
          lineHeight: 1.15,
          textShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}
      >
        {active.text}
      </div>
    </div>
  );
};
