import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export type TransitionKind = "fade" | "slide-up" | "wipe" | "none";

type Props = {
  children: React.ReactNode;
  durationInFrames: number;
  kind?: TransitionKind;
  /** Length of the in/out fade in frames. */
  edgeFrames?: number;
};

export const SceneTransition: React.FC<Props> = ({
  children,
  durationInFrames,
  kind = "fade",
  edgeFrames = 8,
}) => {
  const frame = useCurrentFrame();
  if (kind === "none") return <>{children}</>;

  const edge = Math.min(edgeFrames, Math.floor(durationInFrames / 3));
  const opacity = interpolate(
    frame,
    [0, edge, durationInFrames - edge, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (kind === "slide-up") {
    const y = interpolate(
      frame,
      [0, edge, durationInFrames - edge, durationInFrames],
      [40, 0, 0, -40],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return (
      <AbsoluteFill style={{ opacity, transform: `translateY(${y}px)` }}>
        {children}
      </AbsoluteFill>
    );
  }

  if (kind === "wipe") {
    const reveal = interpolate(
      frame,
      [0, edge * 2, durationInFrames - edge * 2, durationInFrames],
      [0, 100, 100, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return (
      <AbsoluteFill
        style={{
          clipPath: `inset(0 ${100 - reveal}% 0 0)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
