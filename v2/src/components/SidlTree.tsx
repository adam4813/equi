import React from "react";
import { SidlType } from "../utilities/sidlParse";
import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/core/dist";

const SidlTree: React.FC<{ sidl: Map<string, SidlType> }> = ({ sidl }) => (
  <Box>
    {Array.from(sidl.values()).map(sidlElement => (
      <Accordion allowMultiple key={sidlElement.name}>
        <AccordionItem>
          <AccordionHeader>
            <Box flex="1" textAlign="left">
              {sidlElement.name}
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel pb={4}>
            {sidlElement.properties.map(property => (
              <Accordion allowMultiple key={property.name}>
                <AccordionItem>
                  <AccordionHeader>
                    <Box flex="1" textAlign="left">
                      {property.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionHeader>
                  <AccordionPanel pb={4}>
                    <Box>Is array: {property.isArray ? "true" : "false"}</Box>
                    <Box>Is item: {property.isItem ? "true" : "false"}</Box>
                    <Box>Default Value: {property.defaultValue}</Box>
                    <Box>Type: {property.type?.name}</Box>
                    {property.type?.properties.map(typeProperty=> (
                        <Accordion allowMultiple key={typeProperty.name}>
                          <AccordionItem>
                            <AccordionHeader>
                              <Box flex="1" textAlign="left">
                                {typeProperty.name}
                              </Box>
                              <AccordionIcon />
                            </AccordionHeader>
                            <AccordionPanel pb={4}>
                              <Box>Is array: {typeProperty.isArray ? "true" : "false"}</Box>
                              <Box>Is item: {typeProperty.isItem ? "true" : "false"}</Box>
                              <Box>Default Value: {typeProperty.defaultValue}</Box>
                              <Box>Type: {typeProperty.type?.name}</Box>
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    ))}
  </Box>
);

export default SidlTree;
