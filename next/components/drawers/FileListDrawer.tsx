import React from "react";
import {
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
} from "@chakra-ui/react";
import { useFiles } from "../../context/fileContext";

const FileListDrawer: React.FC<{
	isOpen: boolean;
	onClose: () => void;
}> = ({ isOpen, onClose }) => {
	const { files, setActiveFile } = useFiles();
	return (
		<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>List of all items loaded</DrawerHeader>

				<DrawerBody overflowY="scroll">
					{isOpen &&
						Array.from(files.keys()).map((fileName) => (
							<Button
								key={fileName}
								variantColor="blue"
								variant="link"
								onClick={() => {
									onClose();
									setActiveFile(files.get(fileName));
								}}
							>
								{fileName}
							</Button>
						))}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default FileListDrawer;
