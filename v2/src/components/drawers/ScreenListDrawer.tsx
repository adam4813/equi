import React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex
} from "@chakra-ui/core/dist";

const ScreenListDrawer: React.FC<{
  screens: Map<string, IItem>;
  setActiveScreen(item: IItem): void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ screens, setActiveScreen, isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>List of all screens</DrawerHeader>

        <DrawerBody overflowY="scroll">
          <Flex direction="column">
            {isOpen &&
              Array.from(screens.entries()).map(([name, screen]) => (
                <Button
                  variant="link"
                  onClick={() => {
                    onClose();
                    setActiveScreen(screen);
                  }}
                  justifyContent="flex-start"
                >
                  {name}
                </Button>
              ))}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ScreenListDrawer;
