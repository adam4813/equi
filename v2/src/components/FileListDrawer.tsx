import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay
} from "@chakra-ui/core/dist";
import { Item } from "../utilities/fileParse";
import FileItemList from "./FileItemList";

const FileListDrawer: React.FC<{
  items: Map<string, Map<string, Item>>;
  setActiveItem(item: Item): void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ items, setActiveItem, isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>List of all items loaded</DrawerHeader>

        <DrawerBody overflowY="scroll">
          {isOpen &&
            Array.from(items.keys()).map(fileName => (
              <FileItemList
                fileName={fileName}
                items={Array.from(items.get(fileName)?.values() ?? [])}
                setActiveItem={setActiveItem}
              />
            ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default FileListDrawer;
