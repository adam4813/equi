import React from "react";
import { Box } from "@chakra-ui/core";
import { getOrDefault } from "utilities/fileUtils";
import { TEST_UI_NAME } from "App";
import Ui2DAnimation from "renderers/Ui2DAnimation";
import FrameTemplate from "renderers/FrameTemplate";

export const textures: Record<string, string> = {};

export const loadImage = (uiName: string, imageName: string) =>
  getOrDefault(uiName, imageName)
    .then((file) => file?.blob())
    .then((data) => {
      textures[imageName] = URL.createObjectURL(data);
    });

const renderers: { [key: string]: (props: any) => React.ReactElement } = {
  Button: () => <Box>Button</Box>,
  TextureInfo: ({ item }: { item?: IItem }) => {
    const [imageUrl, setImageUrl] = React.useState<string | undefined>(
      textures[item?.name ?? ""]
    );
    React.useEffect(() => {
      if (item && !textures[item?.name]) {
        loadImage(TEST_UI_NAME, item.name).then(() => {
          setImageUrl(textures[item.name]);
          const img = new Image();
          img.addEventListener("load", () => {
            console.log(img.width, img.height);
          });
          img.src = textures[item.name];
        });
      }
    }, [item]);

    return (
      <Box>
        <img src={imageUrl} alt="" />
      </Box>
    );
  },
  Ui2DAnimation: Ui2DAnimation,
  Gauge: () => <Box>Gauge</Box>,
  Label: () => <Box>Label</Box>,
  Screen: () => <Box>Screen</Box>,
  WindowDrawTemplate: ({ item }: { item?: IItem }) => (
    <Box>
      WindowDrawTemplate
      <Box border="1px solid green">
        <FrameTemplate item={item} />
      </Box>
    </Box>
  ),
};

const ItemRenderer = ({ item }: { item?: IItem }) => {
  const Renderer = React.useMemo(() => {
    const renderer = renderers[item?.type.name ?? ""];

    return renderer ?? (() => <Box />);
  }, [item]);
  return (
    <Box>
      <Renderer item={item} key={item?.name} />
    </Box>
  );
};

export default ItemRenderer;
