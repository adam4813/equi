import React from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure
} from "@chakra-ui/core/dist";
import { Item } from "../utilities/fileParse";
import FileItemList from "./FileItemList";

const ItemListDrawer: React.FC<{
  items: Map<string, Map<string, Item>>;
  setActiveItem(item: Item): void;
}> = ({ items, setActiveItem }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);
  return (
    <>
      <Button ref={btnRef} variantColor="teal" variant="link" onClick={onOpen}>
        Item List
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>List of all items loaded</DrawerHeader>

          <DrawerBody overflowY="scroll">
            {items &&
              Array.from(items.keys()).map(fileName => (
                <FileItemList
                  fileName={fileName}
                  items={Array.from(items.get(fileName)?.values() ?? [])}
                  setActiveItem={setActiveItem}
                />
              ))}
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ItemListDrawer;
