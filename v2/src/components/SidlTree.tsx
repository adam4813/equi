import React from "react";
import { SidlType } from "../utilities/sidlParse";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay
} from "@chakra-ui/core/dist";
import SidlElementType from "./SidlElementType";

const SidlTree: React.FC<{
  sidl: Map<string, SidlType>;
  isOpen: boolean;
  onClose: () => void;
}> = ({ sidl, isOpen, onClose }) => (
  <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>SIDL Props</DrawerHeader>

      <DrawerBody overflowY="scroll">
        {isOpen &&
          Array.from(sidl.values()).map(sidlElement => (
            <SidlElementType sidlElementType={sidlElement} />
          ))}
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

export default SidlTree;
