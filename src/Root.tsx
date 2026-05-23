import React from "react";
import { Composition } from "remotion";
import { TEMPLATES } from "./compositions/registry";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {TEMPLATES.flatMap((template) =>
        template.formats.map((format) => (
          <Composition
            key={format.id}
            id={format.id}
            component={template.component}
            schema={template.schema}
            durationInFrames={template.fallbackDurationInFrames}
            fps={template.fps}
            width={format.width}
            height={format.height}
            defaultProps={{
              compositionId: format.id,
              ...template.defaultProps,
              ...(format.propOverrides ?? {}),
            }}
            calculateMetadata={template.calculateMetadata}
          />
        )),
      )}
    </>
  );
};
