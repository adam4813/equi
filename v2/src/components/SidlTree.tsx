import React from "react";
import { SidlType } from "../utilities/sidlParse";
import { Box } from "@chakra-ui/core/dist";
import SidlElementType from "./SidlElementType";

const SidlTree: React.FC<{ sidl: Map<string, SidlType> }> = ({ sidl }) => (
  <Box>
    {Array.from(sidl.values()).map(sidlElement => (
      <SidlElementType sidlElementType={sidlElement} />
    ))}
  </Box>
);

export default SidlTree;
