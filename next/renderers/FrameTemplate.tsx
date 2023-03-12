import { Box, BoxProps, Grid, Stack } from "@chakra-ui/react";
import React from "react";
import Ui2DAnimation from "./Ui2DAnimation";

const FrameSection = ({
  item,
  ...rest
}: { item: UI2DAnimation } & BoxProps) => (
  <Box
    w={`${item?.propertyValues
      ?.get("Frames")?.[0]
      ?.get("Size")
      ?.get("CX")}px`}
    h={`${item?.propertyValues
      ?.get("Frames")?.[0]
      ?.get("Size")
      ?.get("CY")}px`}
    {...rest}
  >
    <Ui2DAnimation item={item} />
  </Box>
);

const FrameTemplate = ({ item }: { item?: IItem }) => {
  const border = item?.propertyValues.get("Border") as
    | Map<string, IItem | undefined>
    | undefined;
  return (
    <Grid templateRows="repeat(3, 1fr)" templateColumns="repeat(3, 1fr)">
      <FrameSection item={border?.get("TopLeft") as UI2DAnimation} />
      <FrameSection item={border?.get("Top") as UI2DAnimation} flex={1} />
      <FrameSection item={border?.get("TopRight") as UI2DAnimation} />

      <Stack spacing={0}>
        <FrameSection item={border?.get("LeftTop") as UI2DAnimation} />
        <FrameSection item={border?.get("Left") as UI2DAnimation} flex={1} />
        <FrameSection item={border?.get("LeftBottom") as UI2DAnimation} />
      </Stack>
      <Box>
        <Ui2DAnimation item={item?.propertyValues.get("Background") as IItem} />
      </Box>
      <Stack spacing={0}>
        <FrameSection item={border?.get("RightTop") as UI2DAnimation} />
        <FrameSection item={border?.get("Right") as UI2DAnimation} flex={1} />
        <FrameSection item={border?.get("RightBottom") as UI2DAnimation} />
      </Stack>

      <FrameSection item={border?.get("BottomLeft") as UI2DAnimation} />
      <FrameSection item={border?.get("Bottom") as UI2DAnimation} flex={1} />
      <FrameSection item={border?.get("BottomRight") as UI2DAnimation} />
    </Grid>
  );
};

export default FrameTemplate;
