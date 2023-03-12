import { Box, Grid, Stack } from "@chakra-ui/core";
import React from "react";

const FrameTemplate = ({ item }: { item?: IItem }) => {
  return (
    <Grid templateRows="repeat(3, 1fr)" templateColumns="repeat(3, 1fr)">
      <Box>TL</Box>
      <Box>T</Box>
      <Box>TR</Box>

      <Stack spacing={0}>
        <Box>LT</Box>
        <Box flex={1}>L</Box>
        <Box>LB</Box>
      </Stack>
      <Box>M</Box>
      <Stack spacing={0}>
        <Box>LT</Box>
        <Box flex={1}>L</Box>
        <Box>LB</Box>
      </Stack>

      <Box>BL</Box>
      <Box>B</Box>
      <Box>BR</Box>
    </Grid>
  );
};

export default FrameTemplate;
