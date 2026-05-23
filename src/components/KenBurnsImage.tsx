import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  src: string;
  /** Zoom start (1 = no zoom). */
  from?: number;
  /** Zoom end. */
  to?: number;
  /** Pan in normalized -1..1 space. */
  panFrom?: { x: number; y: number };
  panTo?: { x: number; y: number };
  overlay?: string;
};

export const KenBurnsImage: React.FC<Props> = ({
  src,
  from = 1.05,
  to = 1.18,
  panFrom = { x: 0, y: 0 },
  panTo = { x: 0.04, y: -0.03 },
  overlay,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [from, to], {
    extrapolateRight: "clamp",
  });
  const tx = interpolate(frame, [0, durationInFrames], [panFrom.x, panTo.x], {
    extrapolateRight: "clamp",
  });
  const ty = interpolate(frame, [0, durationInFrames], [panFrom.y, panTo.y], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${tx * 100}px, ${ty * 100}px)`,
          transformOrigin: "center",
        }}
      />
      {overlay ? (
        <AbsoluteFill style={{ background: overlay, pointerEvents: "none" }} />
      ) : null}
    </AbsoluteFill>
  );
};
