import React from "react";

import { loadImage, textures } from "components/ItemRenderer";
import { TEST_UI_NAME } from "App";
import { Box } from "@chakra-ui/core";

type Frame = {
  width: string;
  height: string;
  offsetX: string;
  offsetY: string;
  duration: number;
};

const Ui2DAnimation = ({ item }: { item?: IItem }) => {
  const [currentFrame, setCurrentFrame] = React.useState<number>(0);
  const [imageSrc, setImageSrc] = React.useState<string>();
  const [loop] = React.useState(item?.propertyValues.get("Cycle") as boolean);
  const [frames, setFrames] = React.useState<Frame[]>([]);
  React.useEffect(() => {
    Promise.all(
      (item?.propertyValues.get("Frames") as MapProperty[])?.map(
        async (frame: MapProperty) => {
          const textureFileName = frame.get("Texture") as string;
          if (!textures[textureFileName]) {
            await loadImage(TEST_UI_NAME, textureFileName);
          }
          const origin = frame.get("Location") as MapProperty;
          const size = frame.get("Size") as MapProperty;
          const duration = frame.get("Duration") as number;
          setImageSrc(textures[textureFileName]);
          return {
            width: `${size.get("CX")}px`,
            height: `${size.get("CY")}px`,
            offsetX: `-${origin.get("X")}px`,
            offsetY: `-${origin.get("Y")}px`,
            duration,
          };
        }
      )
    ).then((_frames) => {
      setFrames(_frames);
    });
  }, [item]);

  React.useEffect(() => {
    if (frames.length > 1) {
      if (currentFrame === frames.length && !loop) {
        return;
      }
      const timeout = setTimeout(() => {
        setCurrentFrame((_currentFrame) =>
          _currentFrame < frames.length ? _currentFrame + 1 : 0
        );
      }, frames[currentFrame]?.duration);
      return () => clearTimeout(timeout);
    }
  }, [frames, currentFrame]);

  return (
    <Box
      style={{ overflow: "hidden", position: "relative" }}
      width={frames[currentFrame]?.width}
      height={frames[currentFrame]?.height}
    >
      <img
        src={imageSrc}
        alt=""
        style={{
          position: "absolute",
          left: frames[currentFrame]?.offsetX,
          top: frames[currentFrame]?.offsetY,
          maxWidth: "unset",
          zIndex: -1,
        }}
      />
    </Box>
  );
};

export default Ui2DAnimation;
