import React from "react";
import { Box, Button, Collapse, useDisclosure } from "@chakra-ui/core/dist";

const ScreenListItem: React.FC<{
  screen: IItem;
  setActiveItem(item: IItem): void;
}> = ({ screen, setActiveItem }) => {
  const { isOpen, onToggle } = useDisclosure();

  const pieces = React.useMemo(() => {
    const pieces =
      (screen.propertyValues.get("Pieces") as IItem[])?.filter(item => item) ??
      [];
    return pieces;
  }, [screen]);

  return (
    <>
      <Button variantColor="blue" variant="link" onClick={onToggle} mb={1}>
        {screen.name}
      </Button>
      <Collapse isOpen={isOpen}>
        {pieces.map(piece => (
          <Box key={piece.name} onClick={() => setActiveItem(piece)}>
              {`- ${piece.name}`}
          </Box>
        ))}
      </Collapse>
    </>
  );
};

export default ScreenListItem;
