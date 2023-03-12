import React from "react";
import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
} from "@chakra-ui/react";
import SidlElementType from "./SidlElementType";
import { useSidl } from "../../context/sidlContext";

const SidlDrawer: React.FC<{
	isOpen: boolean;
	onClose: () => void;
}> = ({ isOpen, onClose }) => {
	const { sidl } = useSidl();
	return (
		<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>SIDL Props</DrawerHeader>

				<DrawerBody overflowY="scroll">
					{isOpen &&
						Array.from(sidl.values()).map((sidlElement) => (
							<SidlElementType
								key={sidlElement.name}
								sidlElementType={sidlElement}
							/>
						))}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default SidlDrawer;
