import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text
} from "@chakra-ui/core/dist";
import { Item, ItemPropertyValue } from "utilities/fileParse";

const PropElement: React.FC<{
  prop: ItemPropertyValue | ItemPropertyValue[];
}> = ({ prop }) => {
  return Array.isArray(prop) ? (
    <Box pl={4}>
      {(prop as ItemPropertyValue[]).map((propItem, key) => {
        if (propItem instanceof Item) {
          return <Box key={key}>{(propItem as Item).name}</Box>;
        }
        if (propItem instanceof Map) {
          return (
            <Box key={key}>
              {Array.from(
                (propItem as Map<string, string | number | boolean>).entries()
              ).map(([key, value]) => (
                <Box key={key}>
                  {key}:{" "}
                  {typeof value !== "object" ? (
                    value
                  ) : (
                    <PropElement prop={value} />
                  )}
                </Box>
              ))}
            </Box>
          );
        }
      })}
    </Box>
  ) : prop instanceof Map ? (
    <Box pl={4}>
      {Array.from(
        (prop as Map<string, string | number | boolean>).entries()
      ).map(([key, value]) => (
        <Box key={key}>
          {key}:
          {typeof value !== "object" ? value : <PropElement prop={value} />}
        </Box>
      ))}
    </Box>
  ) : prop instanceof Item ? (
    <Text as="span">{prop.name}</Text>
  ) : typeof prop === "string" ? (
    <Text as="span">{prop}</Text>
  ) : (
    <Box>Unknown</Box>
  );
};

const PropTree: React.FC<{ item: Item | undefined }> = ({ item }) => (
  <Accordion allowMultiple>
    <AccordionItem>
      <AccordionHeader>
        <Box flex="1" textAlign="left">
          {item?.name}
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4}>
        {Array.from(item?.propertyValues.entries() ?? []).map(
          ([key, value]) => (
            <Box key={key} textAlign="left">
              {key}:{" "}
              {typeof value !== "object" ? value : <PropElement prop={value} />}
            </Box>
          )
        )}
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export default PropTree;
