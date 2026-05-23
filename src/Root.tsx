import React from "react";
import { Composition } from "remotion";
import {
  NuptialPromo,
  nuptialPromoSchema,
  calculateNuptialPromoMetadata,
} from "./compositions/NuptialPromo";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NuptialReel"
        component={NuptialPromo}
        schema={nuptialPromoSchema}
        durationInFrames={20 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          compositionId: "NuptialReel",
          showLowerThird: true,
        }}
        calculateMetadata={calculateNuptialPromoMetadata}
      />
      <Composition
        id="NuptialSquare"
        component={NuptialPromo}
        schema={nuptialPromoSchema}
        durationInFrames={20 * FPS}
        fps={FPS}
        width={1080}
        height={1080}
        defaultProps={{
          compositionId: "NuptialSquare",
          showLowerThird: false,
        }}
        calculateMetadata={calculateNuptialPromoMetadata}
      />
      <Composition
        id="NuptialLandscape"
        component={NuptialPromo}
        schema={nuptialPromoSchema}
        durationInFrames={20 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          compositionId: "NuptialLandscape",
          showLowerThird: true,
        }}
        calculateMetadata={calculateNuptialPromoMetadata}
      />
    </>
  );
};
