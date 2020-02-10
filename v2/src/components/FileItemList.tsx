import React from "react";
import { Item } from "../utilities/fileParse";
import { Box, Button, Collapse } from "@chakra-ui/core/dist";

const FileItemList: React.FC<{
  fileName: string;
  items: Item[];
  setActiveItem(item: Item): void;
}> = ({ fileName, items, setActiveItem }) => {
  const [show, setShow] = React.useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <Box key={fileName}>
      <Button variantColor="blue" variant="link" onClick={handleToggle}>
        {fileName}
      </Button>
      <Collapse p={2} isOpen={show}>
        {items.map(item => (
          <Box key={item.name} onClick={() => setActiveItem(item)}>
            {item.name}
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};

export default FileItemList;
