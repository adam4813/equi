import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/core/dist";

const PropTree = () => (
  <Accordion allowMultiple>
    <AccordionItem>
      <AccordionHeader>
        <Box flex="1" textAlign="left">
          Section 1 title
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export default PropTree;
